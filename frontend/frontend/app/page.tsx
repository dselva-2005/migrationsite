// app/layout.tsx or app/page.tsx
import Navbar from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ReviewCard } from "@/components/reviewCard"
import Hero from "@/components/hero"
import { ListingCard } from "@/components/listingcard"
import { InfoCard } from "@/components/allinonecard"
import { ScrollProgressCircle } from "@/components/scrollprogress"
import InfoSection from "@/components/infosection"

// import { ListingCarousel } from "@/components/listing-carousel"

// const listings = [
//   {
//     title: "Team of Professionals Migration",
//     imageUrl: "/listing-1.jpg",
//     link: "/listing/team-of-professionals",
//     location: "Doha",
//     rating: 3,
//     totalReviews: 4,
//   },
//   {
//     title: "Tadbeer Excellence",
//     imageUrl: "/listing-2.jpg",
//     link: "/listing/tadbeer-excellence",
//     location: "Dubai",
//     rating: 5,
//     totalReviews: 12,
//   },
//   {
//     title: "Visa Experts Group",
//     imageUrl: "/listing-3.jpg",
//     link: "/listing/visa-experts",
//     location: "Abu Dhabi",
//     rating: 4,
//     totalReviews: 9,
//   },
//   {
//     title: "Migration Consultants",
//     imageUrl: "/listing-4.jpg",
//     link: "/listing/migration-consultants",
//     location: "Sharjah",
//     rating: 4,
//     totalReviews: 7,
//   },
// ]


export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ListingCard
        title="Team of Professionals Migration"
        imageUrl="https://migrationreviews.com/1124/wp-content/uploads/classified-listing/2025/09/Team-of-Professionals-Migration-3-650x480.jpg"
        link="https://migrationreviews.com/1124/listing/team-of-professionals-migration-2/"
        location="Doha"
        rating={3}
        totalReviews={4}
      />
      {/* <ListingCarousel items = {listings}/> */}
      <ReviewCard
        reviewerName="John Doe"
        rating={4}
        reviewText="Great service!"
        businessName="My Business"
        businessLogo="/logo.png"
        businessLink="/business"
        businessWebsite="mybusiness.com"
      />
      <InfoCard
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 64 64"
            className="text-red-500"
          >
            <path
              d="M32,15.5A16.5,16.5,0,1,0,48.5,32,16.519,16.519,0,0,0,32,15.5Zm8.48535,9.51465H38.44971l.26758.26758a9.51493,9.51493,0,1,1-10.4834-1.999,1.4999,1.4999,0,0,1,1.18945,2.75391,6.49742,6.49742,0,1,0,7.17285,1.36621l-.26758-.26758v2.03614a1.5,1.5,0,0,1-3,0V23.51465a1.5044,1.5044,0,0,1,1.5-1.5h5.65674a1.5,1.5,0,0,1,0,3Z"
              fill="currentColor"
            />
          </svg>
        }
        title="Visa Expiring or Has Expired"
        description="See what your options"
        buttonText="Online Services"
        buttonLink="#"
      />
      <InfoSection/>
      <ScrollProgressCircle/>
      <Footer />
    </>
  )
}
