import { handleResponse } from "@/utils/handleResponse";

const API_BASE = '/api/recipes';


const RecipeService = {
    async getAllRecipes() {
        const res = await fetch(`${API_BASE}`, { cache: 'no-store' });
        return handleResponse(res);
    },

    async getRecipeById(recipeId) {
        const res = await fetch(`${API_BASE}/${recipeId}`);
        return handleResponse(res);
    },

    async createRecipe(data) {
        const res = await fetch(`${API_BASE}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse(res);
    },

}

export default RecipeService;