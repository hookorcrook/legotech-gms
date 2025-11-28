/// <reference types="node" />
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data (be careful with this in production)
  await prisma.memberClass.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.member.deleteMany();
  await prisma.class.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.contactForm.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.membership.deleteMany();
  await prisma.trainer.deleteMany();
  await prisma.program.deleteMany();
  await prisma.gallery.deleteMany();
  await prisma.stats.deleteMany();
  await prisma.user.deleteMany();
  await prisma.siteSettings.deleteMany();

  // Create users for each role
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const superAdmin = await prisma.user.create({
    data: {
      email: 'superadmin@pulsefit.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'SUPER_ADMIN',
    },
  });
  console.log(`✓ Created Super Admin (email: superadmin@pulsefit.com, password: password123)`);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@pulsefit.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });
  console.log(`✓ Created Admin (email: admin@pulsefit.com, password: password123)`);

  const manager = await prisma.user.create({
    data: {
      email: 'manager@pulsefit.com',
      password: hashedPassword,
      name: 'Front Desk Manager',
      role: 'MANAGER',
    },
  });
  console.log(`✓ Created Manager (email: manager@pulsefit.com, password: password123)`);

  const trainer = await prisma.user.create({
    data: {
      email: 'trainer@pulsefit.com',
      password: hashedPassword,
      name: 'Head Trainer',
      role: 'TRAINER',
    },
  });
  console.log(`✓ Created Trainer (email: trainer@pulsefit.com, password: password123)`);

  const accountant = await prisma.user.create({
    data: {
      email: 'accountant@pulsefit.com',
      password: hashedPassword,
      name: 'Finance Manager',
      role: 'ACCOUNTANT',
    },
  });
  console.log(`✓ Created Accountant (email: accountant@pulsefit.com, password: password123)`);

  const maintenance = await prisma.user.create({
    data: {
      email: 'maintenance@pulsefit.com',
      password: hashedPassword,
      name: 'Maintenance Staff',
      role: 'MAINTENANCE',
    },
  });
  console.log(`✓ Created Maintenance Staff (email: maintenance@pulsefit.com, password: password123)`);

  // Seed Programs
  const programs = await prisma.program.createMany({
    data: [
      {
        category: 'Strength',
        title: 'Barbell & Kettlebell',
        description: 'Progressive overload cycles to build power and muscle safely.',
        features: ['Technique workshops', '1:1 coaching available', 'Strength testing'],
        isFeatured: true
      },
      {
        category: 'Conditioning',
        title: 'HIIT & Row',
        description: 'Short, intense intervals to spike metabolism and endurance.',
        features: ['Assault bikes', 'Row Erg + SkiErg', 'Heart-rate zones'],
        isFeatured: true
      },
      {
        category: 'Mobility',
        title: 'Stretch & Yoga',
        description: 'Reduce pain, improve range of motion, and recover faster.',
        features: ['Daily classes', 'Recovery lab', 'Breathwork'],
        isFeatured: true
      },
      {
        category: 'Strength',
        title: 'Olympic Lifting',
        description: 'Master the snatch, clean & jerk with expert coaching.',
        features: ['Video analysis', 'Competition prep', 'Mobility work'],
        isFeatured: false
      },
      {
        category: 'Cardio',
        title: 'Spin & Cycling',
        description: 'High-energy indoor cycling classes with music and motivation.',
        features: ['Rhythm rides', 'Endurance builds', 'Power intervals'],
        isFeatured: false
      },
      {
        category: 'Combat',
        title: 'Boxing & Kickboxing',
        description: 'Learn striking techniques while getting an intense workout.',
        features: ['Heavy bag work', 'Pad work', 'Self-defense skills'],
        isFeatured: false
      },
      {
        category: 'Recovery',
        title: 'Pilates & Core',
        description: 'Low-impact exercises to strengthen core and improve posture.',
        features: ['Reformer classes', 'Mat work', 'Injury prevention'],
        isFeatured: false
      },
      {
        category: 'Functional',
        title: 'Boot Camp',
        description: 'Military-style training combining cardio and strength.',
        features: ['Team challenges', 'Outdoor sessions', 'Full body workout'],
        isFeatured: false
      }
    ]
  });
  console.log(`✓ Created ${programs.count} programs`);

  // Seed Trainers (Coaches)
  const trainers = await prisma.trainer.createMany({
    data: [
      {
        name: 'Alex Rivera',
        email: 'alex.rivera@pulsefit.com',
        phone: '+1234567880',
        specialty: 'Strength • Powerlifting',
        type: 'strength',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?q=80&w=1200&auto=format&fit=crop',
        bio: 'Former competitive powerlifter with 10+ years of coaching experience. Specializes in progressive overload and safe lifting techniques.',
        experience: 10,
        certifications: ['CSCS', 'NSCA-CPT', 'USA Powerlifting Level 1'],
        specialties: ['Powerlifting', 'Strength Training', 'Olympic Lifting'],
        salary: 55000,
        status: 'active',
      },
      {
        name: 'Mia Chen',
        email: 'mia.chen@pulsefit.com',
        phone: '+1234567881',
        specialty: 'Conditioning • CrossFit',
        type: 'crossfit',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1554344728-77cf90d9ed26?q=80&w=1200&auto=format&fit=crop',
        bio: 'CrossFit Level 3 certified trainer passionate about functional fitness and high-intensity workouts.',
        experience: 8,
        certifications: ['CrossFit Level 3', 'USAW-1', 'CPR/AED'],
        specialties: ['CrossFit', 'HIIT', 'Metabolic Conditioning'],
        salary: 52000,
        status: 'active',
      },
      {
        name: 'Sam Patel',
        email: 'sam.patel@pulsefit.com',
        phone: '+1234567882',
        specialty: 'Mobility • Yoga',
        type: 'yoga',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop',
        bio: 'RYT-500 certified yoga instructor focusing on flexibility, recovery, and mindfulness practices.',
        experience: 12,
        certifications: ['RYT-500', 'Yin Yoga Certified', 'Anatomy Specialist'],
        specialties: ['Vinyasa Yoga', 'Yin Yoga', 'Mobility Work'],
        salary: 48000,
        status: 'active',
      },
      {
        name: 'Jess Morgan',
        email: 'jess.morgan@pulsefit.com',
        phone: '+1234567883',
        specialty: 'Nutrition • Wellness',
        type: 'wellness',
        isFeatured: true,
        imageUrl: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?q=80&w=1200&auto=format&fit=crop',
        bio: 'Registered dietitian and wellness coach helping clients achieve sustainable lifestyle changes.',
        experience: 7,
        certifications: ['RD', 'LD', 'Precision Nutrition Level 2'],
        specialties: ['Sports Nutrition', 'Weight Management', 'Meal Planning'],
        salary: 50000,
        status: 'active',
      },
      {
        name: 'Marcus Johnson',
        email: 'marcus.johnson@pulsefit.com',
        phone: '+1234567884',
        specialty: 'Boxing • Cardio',
        type: 'boxing',
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=1200&auto=format&fit=crop',
        bio: 'Former amateur boxer bringing intense cardio workouts and self-defense training.',
        experience: 6,
        certifications: ['Boxing Coach Level 2', 'Kickboxing Instructor'],
        specialties: ['Boxing', 'Kickboxing', 'Cardio Conditioning'],
        salary: 45000,
        status: 'active',
      },
      {
        name: 'Emily Davis',
        email: 'emily.davis@pulsefit.com',
        phone: '+1234567885',
        specialty: 'Pilates • Core',
        type: 'pilates',
        isFeatured: false,
        imageUrl: 'https://images.unsplash.com/photo-1573495612522-0491a04e4f43?q=80&w=1200&auto=format&fit=crop',
        bio: 'Pilates expert focused on core strength, posture correction, and injury prevention.',
        experience: 9,
        certifications: ['PMA-CPT', 'Reformer Specialist', 'Prenatal Pilates'],
        specialties: ['Mat Pilates', 'Reformer Pilates', 'Core Training'],
        salary: 47000,
        status: 'active',
      },
    ],
  });
  console.log(`✓ Created ${trainers.count} trainers (coaches)`);

  // Seed Memberships
  const memberships = await prisma.membership.createMany({
    data: [
      {
        name: 'Basic',
        price: 29,
        features: ['Gym access (06:00–22:00)', '2 classes/week', 'Locker + showers'],
        isPopular: false
      },
      {
        name: 'Standard',
        price: 49,
        features: ['Gym access (05:00–23:00)', '5 classes/week', 'Locker + showers', 'Nutrition guide'],
        isPopular: false
      },
      {
        name: 'Pro',
        price: 59,
        features: ['24/7 access', 'Unlimited classes', '1x PT session/month', 'Free analyzer scan'],
        isPopular: true
      },
      {
        name: 'Premium',
        price: 89,
        features: ['24/7 access', 'Unlimited classes', '2x PT sessions/month', 'Free analyzer scan', 'Priority booking'],
        isPopular: true
      },
      {
        name: 'Elite',
        price: 129,
        features: ['24/7 access', 'Unlimited PT sessions', 'Recovery suite', 'Guest passes x4', 'Personalized meal plan'],
        isPopular: false
      },
      {
        name: 'VIP',
        price: 199,
        features: ['24/7 VIP access', 'Unlimited everything', 'Private training area', 'Recovery suite', 'Guest passes x10', 'Personalized meal + training plan'],
        isPopular: false
      }
    ]
  });
  console.log(`✓ Created ${memberships.count} memberships`);

  // Seed Testimonials
  const testimonials = await prisma.testimonial.createMany({
    data: [
      {
        rating: 5,
        content: "I've lost 18 lbs and feel stronger than ever. The coaches are incredibly knowledgeable and supportive. Best decision I made for my health!",
        author: 'Jamie Rodriguez',
        role: 'Member since 2023',
        featured: true,
        approved: true,
      },
      {
        rating: 5,
        content: "Great community and flexible hours. The 24/7 access is a game changer for my busy schedule. The equipment is top-notch and always clean.",
        author: 'Chris Peterson',
        role: 'Fitness Enthusiast',
        featured: true,
        approved: true,
      },
      {
        rating: 5,
        content: "The personal training sessions fixed my shoulder pain. I'm moving better than I have in years. Highly recommend the trainers here!",
        author: 'Priya Singh',
        role: 'Member since 2022',
        featured: true,
        approved: true,
      },
      {
        rating: 4,
        content: "Amazing gym with great facilities. The group classes are fun and challenging. Would give 5 stars if parking was easier.",
        author: 'Marcus Johnson',
        role: 'Weekend Warrior',
        featured: false,
        approved: true,
      },
      {
        rating: 5,
        content: "Transformed my life in 6 months. Down 30 pounds and gained so much confidence. The nutrition guidance was incredibly helpful.",
        author: 'Sarah Chen',
        role: 'Weight Loss Journey',
        featured: false,
        approved: true,
      },
      {
        rating: 5,
        content: "Love the variety of classes offered! From yoga to HIIT, there's something for everyone. The instructors are passionate and motivating.",
        author: 'Alex Martinez',
        role: 'Class Enthusiast',
        featured: false,
        approved: true,
      },
      {
        rating: 4,
        content: "Great gym for beginners. Staff is patient and helps with form. Only wish there were more squat racks during peak hours.",
        author: 'Emily Thompson',
        role: 'Beginner Lifter',
        featured: false,
        approved: true,
      },
      {
        rating: 5,
        content: "Been a member for 3 years and wouldn't go anywhere else. The community feels like family and always pushes me to be better.",
        author: 'David Kim',
        role: 'Long-time Member',
        featured: false,
        approved: false, // Pending approval example
      }
    ]
  });
  console.log(`✓ Created ${testimonials.count} testimonials`);

  // Seed Gallery
  const gallery = await prisma.gallery.createMany({
    data: [
      {
        title: 'State-of-the-art Cardio Zone',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
        category: 'facilities',
        isFeatured: true
      },
      {
        title: 'Modern Weight Training Area',
        imageUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&h=600&fit=crop',
        category: 'facilities',
        isFeatured: true
      },
      {
        title: 'Group HIIT Training Session',
        imageUrl: 'https://images.unsplash.com/photo-1599058917765-a780eda07a3e?w=800&h=600&fit=crop',
        category: 'training',
        isFeatured: true
      },
      {
        title: 'Yoga and Stretching Studio',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
        category: 'facilities',
        isFeatured: false
      },
      {
        title: 'Personal Training Session',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop',
        category: 'training',
        isFeatured: false
      },
      {
        title: 'Boxing Training Area',
        imageUrl: 'https://images.unsplash.com/photo-1517438476312-10d79c077509?w=800&h=600&fit=crop',
        category: 'training',
        isFeatured: false
      },
      {
        title: 'Functional Training Zone',
        imageUrl: 'https://images.unsplash.com/photo-1554284126-aa88f22d8b74?w=800&h=600&fit=crop',
        category: 'gym',
        isFeatured: false
      },
      {
        title: 'Community Fitness Challenge',
        imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=600&fit=crop',
        category: 'events',
        isFeatured: false
      }
    ]
  });
  console.log(`✓ Created ${gallery.count} gallery images`);

  // Seed Stats
  const stats = await prisma.stats.create({
    data: {
      members: 1247,
      coaches: 35,
      classesPerWeek: 50
    }
  });
  console.log('✓ Created stats record');

  // Seed Members
  const createdMemberships = await prisma.membership.findMany();
  const members = await prisma.member.createMany({
    data: [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        status: 'active',
        address: '123 Main St, City, State',
        emergencyContact: '+1234567891',
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+1234567892',
        status: 'active',
        address: '456 Oak Ave, City, State',
        emergencyContact: '+1234567893',
        expiryDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
      },
      {
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        phone: '+1234567894',
        status: 'active',
        address: '789 Pine Rd, City, State',
        emergencyContact: '+1234567895',
        expiryDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
      },
    ],
  });
  console.log(`✓ Created ${members.count} members`);

  // Seed Classes
  const createdTrainers = await prisma.trainer.findMany();
  const classes = await prisma.class.createMany({
    data: [
      {
        name: 'Morning Yoga',
        description: 'Start your day with energizing yoga',
        trainerId: createdTrainers[3]?.id || createdTrainers[0].id,
        schedule: 'Monday, Wednesday, Friday at 6:00 AM',
        day: 'Monday',
        time: '6:00 AM',
        duration: 60,
        capacity: 20,
        enrolled: 15,
      },
      {
        name: 'HIIT Bootcamp',
        description: 'High-intensity interval training',
        trainerId: createdTrainers[1]?.id || createdTrainers[0].id,
        schedule: 'Tuesday, Thursday at 7:00 PM',
        day: 'Tuesday',
        time: '7:00 PM',
        duration: 45,
        capacity: 15,
        enrolled: 12,
      },
      {
        name: 'Strength Training',
        description: 'Build muscle and power',
        trainerId: createdTrainers[0].id,
        schedule: 'Monday, Wednesday, Friday at 5:00 PM',
        day: 'Monday',
        time: '5:00 PM',
        duration: 90,
        capacity: 10,
        enrolled: 8,
      },
    ],
  });
  console.log(`✓ Created ${classes.count} classes`);

  // Seed Plans
  const createdClasses = await prisma.class.findMany();
  const plans = await prisma.plan.createMany({
    data: [
      {
        name: 'Basic Plan',
        durationMonths: 1,
        cost: 49,
        description: 'Perfect for getting started with your fitness journey',
        allowedClasses: [createdClasses[0].id, createdClasses[1].id], // Yoga and HIIT
        features: ['Access to 2 classes', 'Locker room access', 'Basic equipment usage'],
        status: 'active',
      },
      {
        name: 'Standard Plan',
        durationMonths: 3,
        cost: 129,
        description: 'Great value for consistent training',
        allowedClasses: createdClasses.map(c => c.id), // All classes
        features: ['Access to all classes', 'Locker room access', 'All equipment usage', 'Free fitness assessment'],
        status: 'active',
      },
      {
        name: 'Premium Plan',
        durationMonths: 6,
        cost: 239,
        description: 'Best value with personalized coaching',
        allowedClasses: createdClasses.map(c => c.id), // All classes
        features: ['Unlimited class access', 'Personal training sessions', '24/7 gym access', 'Nutrition consultation', 'Guest passes'],
        status: 'active',
      },
      {
        name: 'Elite Annual Plan',
        durationMonths: 12,
        cost: 449,
        description: 'Ultimate package for serious athletes',
        allowedClasses: createdClasses.map(c => c.id), // All classes
        features: ['Everything in Premium', 'Monthly body composition analysis', 'Priority class booking', 'Exclusive workshops', 'Free merchandise'],
        status: 'active',
      },
    ],
  });
  console.log(`✓ Created ${plans.count} plans`);

  // Seed Equipment
  const equipment = await prisma.equipment.createMany({
    data: [
      {
        name: 'Treadmill',
        category: 'Cardio',
        quantity: 10,
        condition: 'good',
        lastMaintenance: new Date('2024-12-01'),
        nextMaintenance: new Date('2025-03-01'),
        purchaseDate: new Date('2023-01-15'),
        cost: 2500,
      },
      {
        name: 'Dumbbells Set',
        category: 'Strength',
        quantity: 20,
        condition: 'excellent',
        purchaseDate: new Date('2024-06-01'),
        cost: 1500,
      },
      {
        name: 'Rowing Machine',
        category: 'Cardio',
        quantity: 5,
        condition: 'good',
        lastMaintenance: new Date('2024-11-15'),
        nextMaintenance: new Date('2025-02-15'),
        purchaseDate: new Date('2023-08-20'),
        cost: 1200,
      },
    ],
  });
  console.log(`✓ Created ${equipment.count} equipment items`);

  // Seed Staff
  const staff = await prisma.staff.createMany({
    data: [
      {
        name: 'Sarah Manager',
        email: 'sarah.manager@pulsefit.com',
        phone: '+1234567896',
        role: 'Manager',
        salary: 65000,
        address: '321 Elm St, City, State',
        emergencyContact: '+1234567897',
        status: 'active',
      },
      {
        name: 'Tom Receptionist',
        email: 'tom.receptionist@pulsefit.com',
        phone: '+1234567898',
        role: 'Receptionist',
        salary: 35000,
        address: '654 Maple Dr, City, State',
        emergencyContact: '+1234567899',
        status: 'active',
      },
    ],
  });
  console.log(`✓ Created ${staff.count} staff members`);

  // Seed Payments
  const createdMembers = await prisma.member.findMany();
  const payments = await prisma.payment.createMany({
    data: [
      {
        memberId: createdMembers[0].id,
        amount: 49,
        paymentMethod: 'credit_card',
        status: 'completed',
        description: 'Monthly membership - Basic',
        paymentDate: new Date('2025-01-15'),
      },
      {
        memberId: createdMembers[1].id,
        amount: 89,
        paymentMethod: 'credit_card',
        status: 'completed',
        description: 'Monthly membership - Pro',
        paymentDate: new Date('2025-01-10'),
      },
      {
        memberId: createdMembers[2].id,
        amount: 129,
        paymentMethod: 'debit_card',
        status: 'completed',
        description: 'Monthly membership - Elite',
        paymentDate: new Date('2025-01-05'),
      },
    ],
  });
  console.log(`✓ Created ${payments.count} payments`);

  // Seed Enrollments with Member Classes
  const createdPlans = await prisma.plan.findMany();
  
  // Enrollment 1: John Doe - Basic Plan with 2 classes
  const enrollment1 = await prisma.enrollment.create({
    data: {
      memberId: createdMembers[0].id,
      planId: createdPlans[0].id,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-02-01'),
      totalCost: 49,
      status: 'active',
    },
  });

  // Enroll John in yoga and HIIT
  await prisma.memberClass.createMany({
    data: [
      {
        memberId: createdMembers[0].id,
        classId: createdClasses[0].id, // Yoga
        enrollmentId: enrollment1.id,
        status: 'active',
      },
      {
        memberId: createdMembers[0].id,
        classId: createdClasses[1].id, // HIIT
        enrollmentId: enrollment1.id,
        status: 'active',
      },
    ],
  });

  // Update payment to link to enrollment
  await prisma.payment.update({
    where: { id: (await prisma.payment.findFirst({ where: { memberId: createdMembers[0].id } }))!.id },
    data: { enrollmentId: enrollment1.id },
  });

  // Enrollment 2: Jane Smith - Standard Plan with all classes
  const enrollment2 = await prisma.enrollment.create({
    data: {
      memberId: createdMembers[1].id,
      planId: createdPlans[1].id,
      startDate: new Date('2025-01-10'),
      endDate: new Date('2025-04-10'),
      totalCost: 129,
      status: 'active',
    },
  });

  await prisma.memberClass.createMany({
    data: createdClasses.map(cls => ({
      memberId: createdMembers[1].id,
      classId: cls.id,
      enrollmentId: enrollment2.id,
      status: 'active',
    })),
  });

  await prisma.payment.update({
    where: { id: (await prisma.payment.findFirst({ where: { memberId: createdMembers[1].id } }))!.id },
    data: { enrollmentId: enrollment2.id },
  });

  // Enrollment 3: Mike Johnson - Premium Plan
  const enrollment3 = await prisma.enrollment.create({
    data: {
      memberId: createdMembers[2].id,
      planId: createdPlans[2].id,
      startDate: new Date('2025-01-05'),
      endDate: new Date('2025-07-05'),
      totalCost: 239,
      status: 'active',
    },
  });

  await prisma.memberClass.createMany({
    data: createdClasses.map(cls => ({
      memberId: createdMembers[2].id,
      classId: cls.id,
      enrollmentId: enrollment3.id,
      status: 'active',
    })),
  });

  await prisma.payment.update({
    where: { id: (await prisma.payment.findFirst({ where: { memberId: createdMembers[2].id } }))!.id },
    data: { enrollmentId: enrollment3.id },
  });

  console.log('✓ Created 3 enrollments with member class assignments');

  // Create default site settings
  await prisma.siteSettings.create({
    // Cast to any to avoid transient type errors if Prisma client types are out-of-sync
    data: {
      siteName: 'PulseFit',
      siteTagline: 'Transform Your Body, Transform Your Life',
      primaryColor: '#dc2626',
      secondaryColor: '#991b1b',
      accentColor: '#fbbf24',
      heroTitle: 'Transform Your Body',
      heroSubtitle: 'Join PulseFit today and start your fitness journey with expert trainers and personalized programs',
      heroButtonText: 'Get Started',
      aboutTitle: 'Why Choose PulseFit?',
      aboutDescription: 'We offer world-class facilities, expert trainers, flexible schedules, and a supportive community to help you achieve your fitness goals.',
      contactEmail: 'info@pulsefit.com',
      contactPhone: '+1 (555) 123-4567',
      contactAddress: '123 Fitness Street, Workout City, WC 12345',
      mapLatitude: '40.7128',
  mapLongitude: '-74.0060',
  mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509374!2d144.95373531531565!3d-37.817209979751!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ5JzA0LjAiUyAxNDTCsDU2JzI4LjAiRQ!5e0!3m2!1sen!2s!4v1614643243456',
      mapZoom: 15,
      facebookUrl: 'https://facebook.com/pulsefit',
      instagramUrl: 'https://instagram.com/pulsefit',
      twitterUrl: 'https://twitter.com/pulsefit',
      youtubeUrl: 'https://youtube.com/@pulsefit',
      businessHours: {
        monday: '6:00 AM - 10:00 PM',
        tuesday: '6:00 AM - 10:00 PM',
        wednesday: '6:00 AM - 10:00 PM',
        thursday: '6:00 AM - 10:00 PM',
        friday: '6:00 AM - 10:00 PM',
        saturday: '8:00 AM - 8:00 PM',
        sunday: '8:00 AM - 8:00 PM',
      },
    } as any,
  });
  console.log('✓ Created default site settings');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
