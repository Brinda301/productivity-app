const BASE_URL = 'https://trackapi.nutritionix.com/v2';

export interface NutritionData {
  name: string;
  servingSize: number;
  servingUnit: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  potassium?: number;
}

export async function searchFood(query: string): Promise<NutritionData[]> {
  const res = await fetch(`${BASE_URL}/natural/nutrients`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-app-id': process.env.NUTRITIONIX_APP_ID!,
      'x-app-key': process.env.NUTRITIONIX_API_KEY!,
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Nutrition API error: ${res.statusText}`);
  }

  const data = await res.json();
  return data.foods.map((food: any) => ({
    name: food.food_name,
    servingSize: food.serving_weight_grams,
    servingUnit: 'g',
    calories: food.nf_calories,
    protein: food.nf_protein,
    carbs: food.nf_total_carbohydrate,
    fat: food.nf_total_fat,
    fiber: food.nf_dietary_fiber,
    sugar: food.nf_sugars,
    sodium: food.nf_sodium,
    potassium: food.nf_potassium,
  }));
}

export async function searchInstant(query: string) {
  const res = await fetch(`${BASE_URL}/search/instant?query=${encodeURIComponent(query)}`, {
    headers: {
      'x-app-id': process.env.NUTRITIONIX_APP_ID!,
      'x-app-key': process.env.NUTRITIONIX_API_KEY!,
    },
  });

  if (!res.ok) {
    throw new Error(`Nutrition API error: ${res.statusText}`);
  }

  const data = await res.json();
  return {
    common: data.common || [],
    branded: data.branded || [],
  };
}
