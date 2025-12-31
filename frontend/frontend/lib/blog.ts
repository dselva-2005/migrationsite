// lib/blog.ts
export type BlogPost = {
    slug: string
    title: string
    excerpt: string
    content: string
    image: string
    category: string
    author: string
    date: string
    views: number
    rating: number
    reviewCount: number
}

export const blogs: BlogPost[] = [
    {
        slug: "new-freehand-templates",
        title: "New Freehand Templates, Built for the Whole Team",
        excerpt:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Felis amet laoreet phasellus sed volutpat...",
        content:
            "FULL BLOG CONTENT HERE...\n\nThis article explains how modern design systems improve collaboration across teams.",
        image:
            "https://images.unsplash.com/photo-1551218808-94e220e084d2",
        category: "Burgers",
        author: "admin",
        date: "October 24, 2022",
        views: 1582,
        rating: 3.5,
        reviewCount: 1,
    },
    {
        slug: "ultimate-street-burger-guide",
        title: "The Ultimate Street Burger Guide for Food Lovers",
        excerpt:
            "From smashed patties to secret sauces, discover what makes a street burger unforgettable...",
        content:
            "FULL BLOG CONTENT HERE...\n\nWe explore the best techniques, ingredients, and trends in street burgers.",
        image:
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd",
        category: "Street Food",
        author: "john_doe",
        date: "January 12, 2023",
        views: 3240,
        rating: 4.5,
        reviewCount: 12,
    },
    {
        slug: "why-restaurant-branding-matters",
        title: "Why Restaurant Branding Matters More Than Ever",
        excerpt:
            "Strong branding is no longer optional for restaurants that want to stand out in a crowded market...",
        content:
            "FULL BLOG CONTENT HERE...\n\nBranding influences customer perception, loyalty, and long-term growth.",
        image:
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5",
        category: "Business",
        author: "editor",
        date: "March 5, 2023",
        views: 980,
        rating: 4.0,
        reviewCount: 5,
    },
    {
        slug: "perfect-burger-photography",
        title: "How to Shoot the Perfect Burger for Social Media",
        excerpt:
            "Lighting, angles, and styling tips to make your burgers look irresistible online...",
        content:
            "FULL BLOG CONTENT HERE...\n\nLearn how food photographers make burgers pop on Instagram.",
        image:
            "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe",
        category: "Photography",
        author: "sarah_k",
        date: "June 18, 2023",
        views: 2104,
        rating: 4.8,
        reviewCount: 22,
    },
    {
        slug: "fast-food-trends-2024",
        title: "Fast Food Trends That Will Dominate 2024",
        excerpt:
            "Plant-based patties, AI-driven kitchens, and hyper-local menus are reshaping fast food...",
        content:
            "FULL BLOG CONTENT HERE...\n\nA deep dive into the innovations changing the fast-food industry.",
        image:
            "https://images.unsplash.com/photo-1550547660-d9450f859349",
        category: "Trends",
        author: "admin",
        date: "November 2, 2023",
        views: 4120,
        rating: 4.2,
        reviewCount: 18,
    },
]
