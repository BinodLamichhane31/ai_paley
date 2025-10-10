import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { EventModel } from '../models/Event'
import { DemoRequestModel } from '../models/DemoRequest'
import { ReviewModel } from '../models/Review'
import { AdminUserModel } from '../models/AdminUser'
import { EventRegistrationModel } from '../models/EventRegistration'

// ES module compatibility
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config()

export async function seedData() {
  try {
    console.log('🌱 Starting Nepalese context data seeding...')
    console.log('🔗 Connecting to database...')

    // Connect to MongoDB if not already connected
    if (mongoose.connection.readyState === 0) {
      const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/ai_solutions'
      await mongoose.connect(mongoUri)
      console.log('✅ Connected to MongoDB')
      console.log(`📡 Database: ${mongoUri}`)
    }

    // Clear existing data - ALWAYS clear before seeding
    console.log('🗑️  Clearing existing data...')
    const clearResults = await Promise.all([
      EventModel.deleteMany({}),
      DemoRequestModel.deleteMany({}),
      ReviewModel.deleteMany({}),
      EventRegistrationModel.deleteMany({}),
      AdminUserModel.deleteMany({})
    ])

    console.log('✅ Database cleared successfully:')
    console.log(`   - Events deleted: ${clearResults[0].deletedCount}`)
    console.log(`   - Demo requests deleted: ${clearResults[1].deletedCount}`)
    console.log(`   - Reviews deleted: ${clearResults[2].deletedCount}`)
    console.log(`   - Event registrations deleted: ${clearResults[3].deletedCount}`)
    console.log(`   - Admin users deleted: ${clearResults[4].deletedCount}`)

    // Seed Admin Users
    const hashedPassword = await bcrypt.hash('Admin@123', 10)
    
    const adminUsers = await AdminUserModel.insertMany([
      {
        email: 'admin@aisolutions.np',
        passwordHash: hashedPassword,
        name: 'Adish Karki',
        role: 'admin'
      },
      {
        email: 'superadmin@aisolutions.np',
        passwordHash: hashedPassword,
        name: 'Adish Karki',
        role: 'admin'
      }
    ])

    console.log('👤 Created admin users')

    // Seed Events with Nepalese context
    const events = await EventModel.insertMany([
      {
        title: "Digital Transformation in Nepalese Banking Sector",
        description: "Join us for an insightful webinar on how Nepalese banks are embracing digital transformation. Learn about the latest fintech innovations, mobile banking trends, and digital payment solutions that are revolutionizing Nepal's financial landscape. This session will cover case studies from major Nepalese banks and explore opportunities for technology integration.",
        startAt: new Date('2024-02-15T10:00:00Z'),
        endAt: new Date('2024-02-15T12:00:00Z'),
        location: "Kathmandu, Nepal",
        capacity: 100,
        categories: ["Webinar"],
        coverImageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800",
        featured: true,
        isPublished: true,
        speakers: [
          {
            name: "Dr. Binod Rijal",
            title: "Chief Technology Officer, Nepal Rastra Bank"
          },
          {
            name: "Sushma Gurung",
            title: "Head of Digital Banking, Nabil Bank"
          }
        ],
        agenda: [
          {
            time: "10:00 AM",
            topic: "Welcome and Introduction"
          },
          {
            time: "10:15 AM",
            topic: "Current State of Digital Banking in Nepal"
          },
          {
            time: "11:00 AM",
            topic: "Case Study: Mobile Banking Implementation"
          },
          {
            time: "11:30 AM",
            topic: "Future Trends and Opportunities"
          },
          {
            time: "11:45 AM",
            topic: "Q&A Session"
          }
        ]
      },
      {
        title: "Sustainable Tourism Technology Workshop",
        description: "Explore how technology can enhance Nepal's tourism industry while promoting sustainability. This hands-on workshop will cover digital marketing strategies, eco-friendly booking systems, and community-based tourism platforms. Perfect for tour operators, hoteliers, and tourism professionals looking to modernize their services.",
        startAt: new Date('2024-02-20T09:00:00Z'),
        endAt: new Date('2024-02-20T17:00:00Z'),
        location: "Pokhara, Nepal",
        capacity: 50,
        categories: ["Workshop"],
        coverImageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
        featured: false,
        isPublished: true,
        speakers: [
          {
            name: "Amita Joshi",
            title: "Tourism Technology Consultant"
          },
          {
            name: "Prakash Lama",
            title: "Founder, Himalayan Eco-Tours"
          }
        ],
        agenda: [
          {
            time: "9:00 AM",
            topic: "Registration and Welcome"
          },
          {
            time: "9:30 AM",
            topic: "Digital Marketing for Tourism"
          },
          {
            time: "11:00 AM",
            topic: "Break"
          },
          {
            time: "11:15 AM",
            topic: "Sustainable Booking Systems"
          },
          {
            time: "1:00 PM",
            topic: "Lunch Break"
          },
          {
            time: "2:00 PM",
            topic: "Community Tourism Platforms"
          },
          {
            time: "4:00 PM",
            topic: "Hands-on Workshop"
          },
          {
            time: "5:00 PM",
            topic: "Closing and Networking"
          }
        ]
      },
      {
        title: "Nepal Tech Summit 2024",
        description: "The premier technology conference in Nepal, bringing together industry leaders, startups, and tech enthusiasts. Featuring keynote speeches, panel discussions, startup pitches, and networking opportunities. This year's theme focuses on 'Building Nepal's Digital Future' with emphasis on local innovation and global collaboration.",
        startAt: new Date('2024-03-10T08:00:00Z'),
        endAt: new Date('2024-03-12T18:00:00Z'),
        location: "Kathmandu, Nepal",
        capacity: 500,
        categories: ["Conference"],
        coverImageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        featured: true,
        isPublished: true,
        speakers: [
          {
            name: "Dr. Mahabir Pun",
            title: "Rural Internet Pioneer and Social Entrepreneur"
          },
          {
            name: "Ranjit Acharya",
            title: "CEO, YoungInnovations Pvt. Ltd."
          },
          {
            name: "Sagar Devkota",
            title: "Co-founder, Foodmandu"
          },
          {
            name: "Niraj Khanal",
            title: "Founder, CloudFactory"
          }
        ],
        agenda: [
          {
            time: "Day 1 - March 10",
            topic: "Opening Ceremony and Keynote Speeches"
          },
          {
            time: "Day 1 - Afternoon",
            topic: "Startup Pitch Competition"
          },
          {
            time: "Day 2 - March 11",
            topic: "Panel Discussions and Technical Sessions"
          },
          {
            time: "Day 2 - Afternoon",
            topic: "Workshops and Networking"
          },
          {
            time: "Day 3 - March 12",
            topic: "Closing Ceremony and Awards"
          }
        ]
      },
      {
        title: "E-Governance Implementation in Nepal",
        description: "Learn about the latest e-governance initiatives in Nepal and how technology is transforming public service delivery. This webinar covers digital identity systems, online service portals, and citizen engagement platforms that are making government services more accessible and efficient.",
        startAt: new Date('2024-02-25T14:00:00Z'),
        endAt: new Date('2024-02-25T16:00:00Z'),
        location: "Online Event",
        capacity: 200,
        categories: ["Webinar"],
        coverImageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
        featured: false,
        isPublished: true,
        speakers: [
          {
            name: "Kiran Rana",
            title: "Director, Department of Information Technology"
          }
        ],
        agenda: [
          {
            time: "2:00 PM",
            topic: "Welcome and Overview"
          },
          {
            time: "2:15 PM",
            topic: "Current E-Governance Projects"
          },
          {
            time: "3:00 PM",
            topic: "Digital Nepal Framework"
          },
          {
            time: "3:30 PM",
            topic: "Citizen Feedback and Q&A"
          }
        ]
      },
      {
        title: "AgriTech Innovation Workshop",
        description: "Discover how technology is revolutionizing agriculture in Nepal. This hands-on workshop covers precision farming, mobile-based market access, weather monitoring systems, and sustainable farming practices. Ideal for farmers, agricultural students, and agribusiness professionals.",
        startAt: new Date('2024-03-05T09:00:00Z'),
        endAt: new Date('2024-03-05T16:00:00Z'),
        location: "Chitwan, Nepal",
        capacity: 75,
        categories: ["Workshop"],
        coverImageUrl: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800",
        featured: false,
        isPublished: true,
        speakers: [
          {
            name: "Dr. Ram Prasad",
            title: "Agricultural Technology Specialist"
          },
          {
            name: "Sunita Thapa",
            title: "Founder, Smart Farming Nepal"
          }
        ],
        agenda: [
          {
            time: "9:00 AM",
            topic: "Introduction to AgriTech"
          },
          {
            time: "10:00 AM",
            topic: "Mobile Apps for Farmers"
          },
          {
            time: "11:00 AM",
            topic: "Break"
          },
          {
            time: "11:15 AM",
            topic: "Weather Monitoring Systems"
          },
          {
            time: "12:30 PM",
            topic: "Lunch"
          },
          {
            time: "1:30 PM",
            topic: "Market Access Platforms"
          },
          {
            time: "3:00 PM",
            topic: "Hands-on Demonstration"
          },
          {
            time: "4:30 PM",
            topic: "Discussion and Networking"
          }
        ]
      }
    ])

    console.log('🎉 Created events')

    // Seed Demo Requests with Nepalese context
    const demoRequests = await DemoRequestModel.insertMany([
      {
        name: "Suresh Maharjan",
        email: "suresh.maharjan@gmail.com",
        phone: "+977-9841234567",
        company: "Kathmandu Valley Bank",
        country: "Nepal",
        interestArea: "AI Assistant",
        message: "We are interested in implementing AI-powered customer service for our banking operations. Would like to see a demo of your AI assistant capabilities for handling Nepali language queries.",
        status: "new",
        note: "High priority client - major bank in Kathmandu"
      },
      {
        name: "Priya Sharma",
        email: "priya.sharma@nepaltourism.com",
        phone: "+977-9856789012",
        company: "Nepal Tourism Board",
        country: "Nepal",
        interestArea: "Automation",
        message: "Looking for automation solutions to streamline our tour booking processes and improve customer experience. Particularly interested in multi-language support for international tourists.",
        status: "in_progress",
        note: "Follow up scheduled for next week"
      },
      {
        name: "Raj Kumar Gurung",
        email: "raj.gurung@agricoop.np",
        phone: "+977-9865432109",
        company: "Agricultural Cooperative Society",
        country: "Nepal",
        interestArea: "Analytics",
        message: "We need analytics tools to track crop yields, weather patterns, and market prices. Looking for solutions that work well in rural areas with limited internet connectivity.",
        status: "closed",
        note: "Project completed successfully - client satisfied"
      },
      {
        name: "Anita Thapa",
        email: "anita.thapa@techstartup.np",
        phone: "+977-9876543210",
        company: "Himalayan Tech Solutions",
        country: "Nepal",
        interestArea: "AI Assistant",
        message: "Startup company developing mobile apps for local businesses. Need AI integration for customer support and business analytics. Budget-conscious but very interested in your solutions.",
        status: "new",
        note: "Startup client - potential for long-term partnership"
      },
      {
        name: "Dr. Bikram Singh",
        email: "bikram.singh@tribhuvan.edu.np",
        phone: "+977-9845678901",
        company: "Tribhuvan University",
        country: "Nepal",
        interestArea: "Other",
        message: "University research project on digital transformation in education. Looking for comprehensive technology solutions that can be adapted for academic institutions in Nepal.",
        status: "in_progress",
        note: "Academic partnership opportunity"
      },
      {
        name: "Maya Tamang",
        email: "maya.tamang@womenentreprenurs.np",
        phone: "+977-9854321098",
        company: "Women Entrepreneurs Association",
        country: "Nepal",
        interestArea: "Automation",
        message: "Representing a group of women entrepreneurs in Kathmandu. We need automation tools to help manage our businesses more efficiently. Looking for user-friendly solutions with training support.",
        status: "new",
        note: "Group training session requested"
      },
      {
        name: "Nabin Shrestha",
        email: "nabin.shrestha@ecommerce.np",
        phone: "+977-9867890123",
        company: "Nepal E-commerce Hub",
        country: "Nepal",
        interestArea: "Analytics",
        message: "E-commerce platform serving local businesses across Nepal. Need advanced analytics to understand customer behavior and optimize our platform for better user experience.",
        status: "closed",
        note: "Implementation completed - excellent results"
      }
    ])

    console.log('📋 Created demo requests')

    // Seed Reviews with Nepalese context
    const reviews = await ReviewModel.insertMany([
      {
        rating: 5,
        comment: "Excellent webinar on digital banking! The speakers provided great insights into Nepal's fintech landscape. Very relevant content for our banking sector.",
        name: "Krishna Adhikari",
        email: "krishna.adhikari@bank.com.np"
      },
      {
        rating: 4,
        comment: "The tourism technology workshop was very informative. Learned a lot about sustainable tourism practices and digital marketing strategies. Would love to see more such workshops in Pokhara.",
        name: "Rita Gurung",
        email: "rita.gurung@hotel.com.np"
      },
      {
        rating: 5,
        comment: "Nepal Tech Summit was outstanding! Great networking opportunities and inspiring speakers. Dr. Mahabir Pun's keynote was particularly motivating. Looking forward to next year's summit.",
        name: "Arjun Thapa",
        email: "arjun.thapa@startup.np"
      },
      {
        rating: 4,
        comment: "The e-governance webinar was insightful. Good to see the government's commitment to digital transformation. However, I would have liked more details on implementation timelines.",
        name: "Sita Paudel",
        email: "sita.paudel@gov.np"
      },
      {
        rating: 5,
        comment: "AgriTech workshop was fantastic! The practical demonstrations were very helpful. As a farmer, I can see how technology can really improve our farming practices. Thank you for organizing this.",
        name: "Gopal Prasad",
        email: "gopal.prasad@farmer.np"
      },
      {
        rating: 3,
        comment: "Good content overall, but the event could have been better organized. Some technical issues with the online platform. Still learned a lot though.",
        name: "Anonymous",
        email: ""
      },
      {
        rating: 5,
        comment: "Amazing event! The speakers were knowledgeable and the content was very relevant to Nepal's context. The networking opportunities were great. Highly recommend to anyone in the tech industry.",
        name: "Binita Shrestha",
        email: "binita.shrestha@tech.np"
      }
    ])

    console.log('⭐ Created reviews')

    // Seed Event Registrations (only if events were created successfully)
    let eventRegistrations: any[] = []
    if (events && events.length >= 3) {
      eventRegistrations = await EventRegistrationModel.insertMany([
        {
          eventId: events[0]?._id,
          name: "Suresh Maharjan",
          email: "suresh.maharjan@gmail.com",
          phone: "+977-9841234567",
          company: "Kathmandu Valley Bank",
          status: "confirmed"
        },
        {
          eventId: events[0]?._id,
          name: "Priya Sharma",
          email: "priya.sharma@nepaltourism.com",
          phone: "+977-9856789012",
          company: "Nepal Tourism Board",
          status: "confirmed"
        },
        {
          eventId: events[1]?._id,
          name: "Raj Kumar Gurung",
          email: "raj.gurung@agricoop.np",
          phone: "+977-9865432109",
          company: "Agricultural Cooperative Society",
          status: "confirmed"
        },
        {
          eventId: events[1]?._id,
          name: "Anita Thapa",
          email: "anita.thapa@techstartup.np",
          phone: "+977-9876543210",
          company: "Himalayan Tech Solutions",
          status: "pending"
        },
        {
          eventId: events[2]?._id,
          name: "Dr. Bikram Singh",
          email: "bikram.singh@tribhuvan.edu.np",
          phone: "+977-9845678901",
          company: "Tribhuvan University",
          status: "confirmed"
        },
        {
          eventId: events[2]?._id,
          name: "Maya Tamang",
          email: "maya.tamang@womenentreprenurs.np",
          phone: "+977-9854321098",
          company: "Women Entrepreneurs Association",
          status: "confirmed"
        },
        {
          eventId: events[2]?._id,
          name: "Nabin Shrestha",
          email: "nabin.shrestha@ecommerce.np",
          phone: "+977-9867890123",
          company: "Nepal E-commerce Hub",
          status: "confirmed"
        }
      ])
    }

    console.log('📝 Created event registrations')

    console.log('✅ Nepalese context data seeding completed successfully!')
    console.log(`📊 Summary:`)
    console.log(`   - Admin Users: ${adminUsers.length}`)
    console.log(`   - Events: ${events.length}`)
    console.log(`   - Demo Requests: ${demoRequests.length}`)
    console.log(`   - Reviews: ${reviews.length}`)
    console.log(`   - Event Registrations: ${eventRegistrations.length}`)

    // Close database connection if we opened it
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
      console.log('🔌 Database connection closed')
    }

  } catch (error) {
    console.error('❌ Error seeding Nepalese data:', error)
    
    // Close database connection on error
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close()
      console.log('🔌 Database connection closed due to error')
    }
    
    throw error
  }
}

// Function to run the seeder
export async function runSeeder() {
  try {
    console.log('⚠️  WARNING: This will DELETE ALL existing data and replace it with new seed data!')
    console.log('📋 The following collections will be cleared:')
    console.log('   - Events')
    console.log('   - Demo Requests') 
    console.log('   - Reviews')
    console.log('   - Event Registrations')
    console.log('   - Admin Users')
    console.log('')
    
    // In a real scenario, you might want to add a confirmation prompt here
    // For now, we'll proceed automatically since this is a seeder script
    
    await seedData()
    process.exit(0)
  } catch (error) {
    console.error('Seeder failed:', error)
    process.exit(1)
  }
}

// Run seeder if this file is executed directly
if (process.argv[1] === __filename) {
  runSeeder()
}
