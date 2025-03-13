"""Crop data including optimal conditions and recommendations"""

import pandas as pd

# Crop data structure with optimal conditions
CROP_DATA = {
    "Rice": {
        "name": "Rice",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 60, "max": 80},
            "rainfall": {"min": 800, "max": 2000}
        }
    },
    "Wheat": {
        "name": "Wheat",
        "optimal_conditions": {
            "temperature": {"min": 15, "max": 30},
            "humidity": {"min": 50, "max": 70},
            "rainfall": {"min": 500, "max": 1200}
        }
    },
    "Maize": {
        "name": "Maize",
        "optimal_conditions": {
            "temperature": {"min": 18, "max": 32},
            "humidity": {"min": 50, "max": 75},
            "rainfall": {"min": 600, "max": 1100}
        }
    },
    "Cotton": {
        "name": "Cotton",
        "optimal_conditions": {
            "temperature": {"min": 21, "max": 35},
            "humidity": {"min": 50, "max": 70},
            "rainfall": {"min": 500, "max": 1500}
        }
    },
    "Sugarcane": {
        "name": "Sugarcane",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 60, "max": 80},
            "rainfall": {"min": 1000, "max": 2000}
        }
    },
    "Potato": {
        "name": "Potato",
        "optimal_conditions": {
            "temperature": {"min": 15, "max": 25},
            "humidity": {"min": 50, "max": 75},
            "rainfall": {"min": 500, "max": 1000}
        }
    },
    "Groundnut": {
        "name": "Groundnut",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 30},
            "humidity": {"min": 50, "max": 70},
            "rainfall": {"min": 500, "max": 1200}
        }
    },
    "Soybean": {
        "name": "Soybean",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 30},
            "humidity": {"min": 50, "max": 75},
            "rainfall": {"min": 600, "max": 1000}
        }
    },
    "Coconut": {
        "name": "Coconut",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 70, "max": 90},
            "rainfall": {"min": 1500, "max": 2500}
        }
    },
    "Banana": {
        "name": "Banana",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 70, "max": 90},
            "rainfall": {"min": 1200, "max": 2200}
        }
    },
    "Mango": {
        "name": "Mango",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 50, "max": 80},
            "rainfall": {"min": 750, "max": 1500}
        }
    },
    "Tea": {
        "name": "Tea",
        "optimal_conditions": {
            "temperature": {"min": 18, "max": 30},
            "humidity": {"min": 70, "max": 90},
            "rainfall": {"min": 1500, "max": 3000}
        }
    },
    "Coffee": {
        "name": "Coffee",
        "optimal_conditions": {
            "temperature": {"min": 15, "max": 28},
            "humidity": {"min": 70, "max": 90},
            "rainfall": {"min": 1500, "max": 2500}
        }
    },
    "Jute": {
        "name": "Jute",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 60, "max": 90},
            "rainfall": {"min": 1200, "max": 2000}
        }
    },
    "Rubber": {
        "name": "Rubber",
        "optimal_conditions": {
            "temperature": {"min": 20, "max": 35},
            "humidity": {"min": 70, "max": 90},
            "rainfall": {"min": 2000, "max": 4000}
        }
    }
}

def load_crop_yield_data(file_path):
    """Load crop yield data from a CSV file."""
    try:
        return pd.read_csv(file_path)
    except Exception as e:
        print(f"Error loading crop yield data: {str(e)}")
        return pd.DataFrame()

def average_yield_per_crop(data):
    """Calculate average yield per crop."""
    try:
        return data.groupby('Crop')['Yield'].mean()
    except Exception as e:
        print(f"Error calculating average yield: {str(e)}")
        return pd.Series()

# Load the dataset
crop_yield_data = load_crop_yield_data('data/crop_yield.csv')

# Calculate average yield
average_yields = average_yield_per_crop(crop_yield_data)
