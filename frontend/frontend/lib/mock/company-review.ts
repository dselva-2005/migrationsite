import { CompanyReviewResponse } from "@/types/review"

export const mockCompanyReviewData: CompanyReviewResponse = {
    company: {
        id: "cmp_1",
        name: "BudLove",
        domain: "budlove.com",
        slug: "budlove.com",
        rating: 3.8,
        totalReviews: 214,
        ratingDistribution: {
            5: 120,
            4: 42,
            3: 21,
            2: 15,
            1: 16,
        },
    },

    reviews: [
        {
            id: "rev_1",
            rating: 5,
            title: "Excellent experience",
            body:
                "Fast delivery, good packaging, and customer support was responsive.",
            author: "Rahul S",
            createdAt: "2024-10-12T10:30:00Z",
        },
        {
            id: "rev_2",
            rating: 2,
            title: "Not satisfied",
            body:
                "Product quality was average and delivery was delayed by a week.",
            author: "Anita K",
            createdAt: "2024-09-28T14:10:00Z",
        },
        {
            id: "rev_3",
            rating: 4,
            title: "Good but can improve",
            body:
                "Overall good experience, pricing could be better.",
            author: "Suresh M",
            createdAt: "2024-09-15T08:50:00Z",
        },
        {
            id: "rev_4",
            rating: 5,
            title: "Highly recommended",
            body:
                "Very professional service. Everything was clearly explained and delivered on time.",
            author: "Neha P",
            createdAt: "2024-09-02T12:20:00Z",
        },
        {
            id: "rev_5",
            rating: 1,
            title: "Worst experience",
            body:
                "No response from support and refund took more than a month.",
            author: "Arjun V",
            createdAt: "2024-08-21T16:40:00Z",
        },
        {
            id: "rev_6",
            rating: 3,
            title: "Average service",
            body:
                "Nothing exceptional, but it got the job done eventually.",
            author: "Kavita R",
            createdAt: "2024-08-10T09:15:00Z",
        },
        {
            id: "rev_7",
            rating: 4,
            title: "Smooth process",
            body:
                "The onboarding was smooth and instructions were clear.",
            author: "Mohit L",
            createdAt: "2024-07-30T11:55:00Z",
        },
        {
            id: "rev_8",
            rating: 5,
            title: "Outstanding support",
            body:
                "Support team followed up proactively and resolved my issue quickly.",
            author: "Priya D",
            createdAt: "2024-07-18T13:05:00Z",
        },
        {
            id: "rev_9",
            rating: 2,
            title: "Disappointed",
            body:
                "Expected better quality for the price paid.",
            author: "Ramesh T",
            createdAt: "2024-07-05T17:45:00Z",
        },
        {
            id: "rev_10",
            rating: 4,
            title: "Worth the money",
            body:
                "Decent value and timely delivery. Would consider using again.",
            author: "Sneha J",
            createdAt: "2024-06-22T10:10:00Z",
        },
        {
            id: "rev_11",
            rating: 5,
            title: "Exceeded expectations",
            body:
                "Everything was handled professionally from start to finish.",
            author: "Vikram A",
            createdAt: "2024-06-10T15:00:00Z",
        },
        {
            id: "rev_12",
            rating: 3,
            title: "Okay experience",
            body:
                "Some delays, but the final outcome was acceptable.",
            author: "Pooja N",
            createdAt: "2024-05-28T09:35:00Z",
        },
        {
            id: "rev_13",
            rating: 4,
            title: "Reliable service",
            body:
                "Consistent communication and transparent process.",
            author: "Amit B",
            createdAt: "2024-05-15T14:25:00Z",
        },
        {
            id: "rev_14",
            rating: 5,
            title: "Will use again",
            body:
                "Very satisfied with the overall experience.",
            author: "Shalini C",
            createdAt: "2024-05-02T08:00:00Z",
        },
        {
            id: "rev_15",
            rating: 2,
            title: "Needs improvement",
            body:
                "Process felt rushed and communication could be better.",
            author: "Nikhil S",
            createdAt: "2024-04-20T18:10:00Z",
        },
    ],

    pagination: {
        page: 1,
        pageSize: 10,
        total: 214,
    },
}
