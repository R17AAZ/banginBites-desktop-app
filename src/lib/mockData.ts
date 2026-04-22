export const categories = [
    { name: 'Populer', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Fast Food', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Traditional', icon: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
    { name: 'Drinks', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Desserts', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Healthy', icon: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
    { name: 'BBQ', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Seafood', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
    { name: 'Breakfast', icon: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60' },
    { name: 'Snacks', icon: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
];

export const popularDishes = [
    {
        id: "d1",
        name: "Classic Wagyu Burger",
        price: 15.99,
        image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60",
        kitchenName: "The Sizzling Skillet"
    },
    {
        id: "d2",
        name: "Premium Salmon Sushi",
        price: 24.50,
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
        kitchenName: "Sushi Zen Garden"
    },
    {
        id: "d3",
        name: "Truffle Mushroom Pasta",
        price: 18.25,
        image: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=500&auto=format&fit=crop&q=60",
        kitchenName: "Pasta Paradiso"
    },
    {
        id: "d4",
        name: "Quinoa Power Bowl",
        price: 12.95,
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
        kitchenName: "Green Leaf Eatery"
    }
];

export const kitchens = [
    {
        id: 1,
        name: "The Sizzling Skillet",
        rating: 4.8,
        time: "15-20 min",
        minOrder: "$10",
        description: "Best burgers and steaks in the city.",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=60",
        categories: ["Fast Food", "American"]
    },
    {
        id: 2,
        name: "Sushi Zen Garden",
        rating: 4.9,
        time: "25-35 min",
        minOrder: "$25",
        description: "Authentic Japanese sushi and ramen.",
        image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&auto=format&fit=crop&q=60",
        categories: ["Asian", "Sushi"]
    },
    {
        id: 3,
        name: "Pasta Paradiso",
        rating: 4.7,
        time: "20-30 min",
        minOrder: "$15",
        description: "Handmade pasta and wood-fired pizzas.",
        image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=60",
        categories: ["Italian", "Pasta"]
    },
    {
        id: 4,
        name: "Green Leaf Eatery",
        rating: 4.6,
        time: "10-15 min",
        minOrder: "$12",
        description: "Fresh salads and cold-pressed juices.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=60",
        categories: ["Healthy", "Salads"]
    }
];


