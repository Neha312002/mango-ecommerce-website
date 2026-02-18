import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Check if products already exist
    const existingProducts = await prisma.product.count();
    
    if (existingProducts > 0) {
      return NextResponse.json(
        { message: 'Database already seeded' },
        { status: 200 }
      );
    }

    // Seed products
    const products = await prisma.product.createMany({
      data: [
        {
          name: 'Alphonso Mango',
          price: 12.99,
          description: 'The king of mangoes with rich, creamy texture and aromatic sweetness.',
          details: 'Alphonso mangoes are renowned worldwide for their golden color, smooth texture, and rich taste. Perfect for eating fresh or in desserts.',
          image: '/images/mango1.jpg',
          weight: '1 kg',
          origin: 'Maharashtra, India',
          season: 'April - June',
          nutritional: '60 calories per 100g, Rich in Vitamin C and Fiber',
          stock: 100,
          featured: true,
        },
        {
          name: 'Kesar Mango',
          price: 10.99,
          description: 'Known for its saffron color and uniquely sweet taste.',
          details: 'Kesar mangoes have a distinctive saffron color inside and out. They are incredibly sweet with a hint of citrus flavor.',
          image: '/images/mango2.jpg',
          weight: '1 kg',
          origin: 'Gujarat, India',
          season: 'May - July',
          nutritional: '65 calories per 100g, High in Vitamin A',
          stock: 100,
          featured: true,
        },
        {
          name: 'Dasheri Mango',
          price: 9.99,
          description: 'Fiber-free pulp with an exceptionally sweet flavor.',
          details: 'Dasheri mangoes are elongated with smooth, fiber-free pulp. Perfect for smoothies and mango lassi.',
          image: '/images/mango3.jpg',
          weight: '1 kg',
          origin: 'Uttar Pradesh, India',
          season: 'June - July',
          nutritional: '58 calories per 100g, Low in fat',
          stock: 100,
          featured: false,
        },
        {
          name: 'Totapuri Mango',
          price: 8.99,
          description: 'Firm texture makes it perfect for cooking and pickling.',
          details: 'Totapuri has a distinctive parrot-beak shape. Its firm texture makes it ideal for salads, cooking, and pickling.',
          image: '/images/mango1.jpg',
          weight: '1 kg',
          origin: 'Karnataka, India',
          season: 'May - July',
          nutritional: '55 calories per 100g, Good source of potassium',
          stock: 100,
          featured: false,
        },
        {
          name: 'Langra Mango',
          price: 11.99,
          description: 'Traditional variety loved for its tangy-sweet balance.',
          details: 'Langra mangoes have a unique greenish skin even when ripe. They offer a perfect balance of sweet and tangy flavors.',
          image: '/images/mango2.jpg',
          weight: '1 kg',
          origin: 'Uttar Pradesh, India',
          season: 'July - August',
          nutritional: '62 calories per 100g, Rich in antioxidants',
          stock: 100,
          featured: false,
        },
        {
          name: 'Badami Mango',
          price: 13.99,
          description: 'Buttery smooth with an intense tropical flavor.',
          details: 'Badami mangoes are named after the almond-like shape (Badam means almond). They have a smooth, buttery texture and intense sweetness.',
          image: '/images/mango3.jpg',
          weight: '1 kg',
          origin: 'Karnataka, India',
          season: 'May - June',
          nutritional: '70 calories per 100g, High in beta-carotene',
          stock: 100,
          featured: false,
        },
      ],
    });

    return NextResponse.json(
      {
        message: 'Database seeded successfully',
        productsCreated: products.count,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed database' },
      { status: 500 }
    );
  }
}
