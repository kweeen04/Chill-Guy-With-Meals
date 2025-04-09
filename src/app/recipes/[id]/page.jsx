'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import emailjs from '@emailjs/browser';
import { Heart, Download, Mail, Share2, Star, Twitter, Facebook } from 'lucide-react';
import { use } from 'react';

export default function RecipeDetails({ params }) {
  const resolvedParams = use(params);
  const recipeId = resolvedParams.id;
  
  const { data: session } = useSession();
  const router = useRouter();
  const [recipe, setRecipe] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [analytics, setAnalytics] = useState({ views: 0, ratings: 0, shares: 0 });
  const [activeTab, setActiveTab] = useState('ingredients');

  useEffect(() => {
    const fetchRecipe = async () => {
      const res = await fetch(`/api/recipes/${recipeId}`);
      if (res.ok) {
        const data = await res.json();
        setRecipe(data);
        if (session) {
          setIsFavorite(session.user.favorites.includes(recipeId));
          const ratingRes = await fetch(`/api/ratings?recipeId=${recipeId}`);
          if (ratingRes.ok) setUserRating((await ratingRes.json()).userRating);
          const commentsRes = await fetch(`/api/comments?recipeId=${recipeId}`);
          if (commentsRes.ok) setComments(await commentsRes.json());
        }
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId, action: 'view' }),
        });
        const analyticsRes = await fetch(`/api/analytics?recipeId=${recipeId}`);
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
      } else {
        alert('Recipe not found');
        router.push('/recipes');
      }
    };
    fetchRecipe();
  }, [recipeId, session, router]);

  const toggleFavorite = async () => {
    if (!session) {
      alert('Please sign in to add favorites');
      return;
    }
    try {
      const res = await fetch('/api/user/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId }),
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        alert(isFavorite ? 'Removed from favorites' : 'Added to favorites');
      }
    } catch (error) {
      alert('Failed to update favorites');
    }
  };

  const handleRating = async (rating) => {
    if (!session) {
      alert('Please sign in to rate recipes');
      return;
    }
    try {
      const res = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, rating }),
      });
      if (res.ok) {
        const { averageRating, ratingCount } = await res.json();
        setUserRating(rating);
        setRecipe((prev) => ({ ...prev, averageRating, ratingCount }));
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ recipeId, action: 'rating' }),
        });
        const analyticsRes = await fetch(`/api/analytics?recipeId=${recipeId}`);
        if (analyticsRes.ok) setAnalytics(await analyticsRes.json());
        alert('Rating submitted!');
      }
    } catch (error) {
      alert('Failed to submit rating');
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!session) {
      alert('Please sign in to comment');
      return;
    }
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, text: newComment }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments((prev) => [comment, ...prev]);
        setNewComment('');
        alert('Comment added!');
      }
    } catch (error) {
      alert('Failed to add comment');
    }
  };

  const trackShare = async () => {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recipeId, action: 'share' }),
    });
    const res = await fetch(`/api/analytics?recipeId=${recipeId}`);
    if (res.ok) setAnalytics(await res.json());
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text(recipe.title, 10, 10);
    doc.text(recipe.description, 10, 20);
    doc.text('Ingredients:', 10, 30);
    recipe.ingredients.forEach((ing, i) => doc.text(`${ing.name}: ${ing.amount}`, 10, 40 + i * 10));
    doc.text('Instructions:', 10, 40 + recipe.ingredients.length * 10);
    recipe.instructions.forEach((ins, i) =>
      doc.text(`${i + 1}. ${ins}`, 10, 50 + recipe.ingredients.length * 10 + i * 10)
    );
    doc.save(`${recipe.title}.pdf`);
    trackShare();
    alert('Recipe downloaded as PDF');
  };

  const shareViaEmail = () => {
    const recipientEmail = prompt('Enter recipient email:');
    if (!recipientEmail) return;
    
    const templateParams = {
      to_email: recipientEmail,
      recipe_title: recipe.title,
      recipe_description: recipe.description,
      recipe_link: window.location.href,
    };
    
    emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
    ).then(() => {
      alert('Recipe shared via email');
      trackShare();
    }, () => {
      alert('Failed to send email');
    });
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Recipe link copied to clipboard');
    trackShare();
  };

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=Check out this recipe: ${recipe.title}&url=${window.location.href}`;
    window.open(url, '_blank');
    trackShare();
  };

  const shareOnFacebook = () => {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
    window.open(url, '_blank');
    trackShare();
  };

  if (!recipe) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold">{recipe.title}</h1>
            <button
              onClick={toggleFavorite}
              className={`p-2 rounded-full ${
                isFavorite ? 'bg-red-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <Heart className={isFavorite ? "fill-current" : ""} />
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {recipe.calories} kcal
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {recipe.macros.protein}g Protein
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {recipe.macros.carbs}g Carbs
            </span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {recipe.macros.fat}g Fat
            </span>
          </div>

          <p className="text-gray-600 mb-6">{recipe.description}</p>
          
          <div className="mb-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 ${
                  activeTab === 'ingredients'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('ingredients')}
              >
                Ingredients
              </button>
              <button
                className={`px-4 py-2 ${
                  activeTab === 'instructions'
                    ? 'border-b-2 border-blue-500 text-blue-500'
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('instructions')}
              >
                Instructions
              </button>
            </div>

            {activeTab === 'ingredients' && (
              <ul className="space-y-2">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-center">
                    <span className="w-1/2">{ing.name}</span>
                    <span className="w-1/2 text-gray-600">{ing.amount}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === 'instructions' && (
              <ol className="space-y-4">
                {recipe.instructions.map((ins, i) => (
                  <li key={i} className="flex">
                    <span className="font-bold mr-4">{i + 1}.</span>
                    <span>{ins}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>

          <div className="border-t border-b py-6 my-6">
            <h3 className="text-lg font-semibold mb-2">Rate this Recipe</h3>
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleRating(star)}
                  className="p-1"
                >
                  <Star
                    className={star <= userRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                  />
                </button>
              ))}
              <span className="ml-2 text-gray-600">
                ({recipe.averageRating.toFixed(1)} - {recipe.ratingCount} votes)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <button
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              <Download className="h-4 w-4" /> PDF
            </button>
            <button
              onClick={shareViaEmail}
              className="flex items-center justify-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              <Mail className="h-4 w-4" /> Email
            </button>
            <button
              onClick={shareOnTwitter}
              className="flex items-center justify-center gap-2 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500"
            >
              <Twitter className="h-4 w-4" /> Twitter
            </button>
            <button
              onClick={shareOnFacebook}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Facebook className="h-4 w-4" /> Facebook
            </button>
          </div>

          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 w-full bg-gray-100 px-4 py-2 rounded hover:bg-gray-200 mb-6"
          >
            <Share2 className="h-4 w-4" /> Copy Link
          </button>

          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <p className="text-2xl font-bold">{analytics.views}</p>
              <p className="text-gray-600">Views</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.ratings}</p>
              <p className="text-gray-600">Ratings</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{analytics.shares}</p>
              <p className="text-gray-600">Shares</p>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Comments</h3>
            <form onSubmit={handleCommentSubmit} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Post Comment
              </button>
            </form>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {comment.userId.name[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold">{comment.userId.name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-1">{comment.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}