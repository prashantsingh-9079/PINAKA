"""
Gemma Flash Service for Text Processing
Used for natural language understanding in Object Search and event explanations
"""

import torch
from transformers import AutoTokenizer, AutoModelForCausalLM
from typing import List, Dict, Any, Optional
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class GemmaService:
    """Service for Gemma Flash model inference for text processing tasks"""

    def __init__(self):
        self.model = None
        self.tokenizer = None
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self._load_model()

    def _load_model(self):
        """Load Gemma model and tokenizer"""
        try:
            logger.info(f"Loading Gemma model: {settings.GEMMA_MODEL_NAME}")
            self.tokenizer = AutoTokenizer.from_pretrained(
                settings.GEMMA_MODEL_NAME,
                token=settings.GEMMA_API_KEY
            )
            self.model = AutoModelForCausalLM.from_pretrained(
                settings.GEMMA_MODEL_NAME,
                token=settings.GEMMA_API_KEY,
                torch_dtype=torch.float16 if torch.cuda.is_available() else torch.float32,
                device_map="auto" if torch.cuda.is_available() else None
            )
            logger.info("Gemma model loaded successfully")
        except Exception as e:
            logger.error(f"Failed to load Gemma model: {e}")
            # Fallback to a simpler approach or raise
            raise

    def encode_text(self, text: str) -> List[float]:
        """
        Encode text into embeddings using Gemma
        Used for semantic search in Object Search
        """
        try:
            inputs = self.tokenizer(
                text,
                return_tensors="pt",
                truncation=True,
                max_length=settings.GEMMA_MAX_LENGTH,
                padding=True
            ).to(self.device)

            with torch.no_grad():
                # Get embeddings from the last hidden state
                outputs = self.model(**inputs, output_hidden_states=True)
                # Use mean pooling of last hidden state
                embeddings = outputs.hidden_states[-1].mean(dim=1)
                return embeddings.squeeze().cpu().tolist()
        except Exception as e:
            logger.error(f"Error encoding text: {e}")
            # Return zero vector as fallback
            return [0.0] * 768  # Gemma embedding size

    def generate_explanation(self, prompt: str, max_length: int = 150) -> str:
        """
        Generate natural language explanation for alerts/events
        """
        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=settings.GEMMA_MAX_LENGTH
            ).to(self.device)

            with torch.no_grad():
                outputs = self.model.generate(
                    **inputs,
                    max_length=max_length,
                    num_return_sequences=1,
                    temperature=settings.GEMMA_TEMPERATURE,
                    do_sample=True,
                    pad_token_id=self.tokenizer.eos_token_id
                )

            generated_text = self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            # Remove the original prompt from the output
            explanation = generated_text[len(prompt):].strip()
            return explanation
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return "Unable to generate explanation"

    def process_search_query(self, query: str) -> Dict[str, Any]:
        """
        Process a text search query for Object Search
        Returns structured query understanding
        """
        try:
            # Use Gemma to understand the search intent
            prompt = f"""Analyze this search query for object detection: "{query}"
            Extract:
            1. Object type (person, vehicle, drone, etc.)
            2. Attributes (color, size, behavior)
            3. Context clues
            Return as JSON."""

            explanation = self.generate_explanation(prompt, max_length=100)

            # Parse the explanation to extract structured data
            # This is a simplified version - in practice you'd use more sophisticated parsing
            return {
                "original_query": query,
                "processed_explanation": explanation,
                "embedding": self.encode_text(query),
                "intent": "object_search",
                "confidence": 0.85  # Placeholder
            }
        except Exception as e:
            logger.error(f"Error processing search query: {e}")
            return {
                "original_query": query,
                "error": str(e),
                "embedding": self.encode_text(query) if self.model else [0.0] * 768
            }


# Global instance
gemma_service = GemmaService()