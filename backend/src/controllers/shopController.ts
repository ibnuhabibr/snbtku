import { FastifyRequest, FastifyReply } from 'fastify';
import { db } from '../db/index';
import { users } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import { socketService } from '../services/socketService';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: 'avatar' | 'badge' | 'powerup';
  price: number;
  rarity: 'common' | 'rare' | 'legendary';
  image?: string;
  icon?: string;
  duration?: string;
}

// Static shop items data
const SHOP_ITEMS: ShopItem[] = [
  // Avatars
  {
    id: 'avatar-1',
    name: 'Happy Scholar',
    description: 'Avatar ceria untuk pelajar rajin',
    category: 'avatar',
    price: 500,
    image: '😊',
    rarity: 'common'
  },
  {
    id: 'avatar-2',
    name: 'Genius Master',
    description: 'Avatar eksklusif untuk jenius',
    category: 'avatar',
    price: 1500,
    image: '🤓',
    rarity: 'rare'
  },
  {
    id: 'avatar-3',
    name: 'Champion Elite',
    description: 'Avatar legendaris juara',
    category: 'avatar',
    price: 5000,
    image: '👑',
    rarity: 'legendary'
  },
  {
    id: 'avatar-4',
    name: 'Cool Student',
    description: 'Avatar keren untuk siswa modern',
    category: 'avatar',
    price: 750,
    image: '😎',
    rarity: 'common'
  },
  {
    id: 'avatar-5',
    name: 'Rocket Scientist',
    description: 'Avatar untuk calon ilmuwan',
    category: 'avatar',
    price: 2000,
    image: '🚀',
    rarity: 'rare'
  },
  // Power-ups
  {
    id: 'powerup-1',
    name: 'Double XP',
    description: 'Gandakan XP selama 1 jam',
    category: 'powerup',
    price: 800,
    icon: 'Zap',
    duration: '1 jam',
    rarity: 'common'
  },
  {
    id: 'powerup-2',
    name: 'Streak Shield',
    description: 'Lindungi streak dari putus 1x',
    category: 'powerup',
    price: 1200,
    icon: 'Shield',
    duration: 'Sekali pakai',
    rarity: 'common'
  },
  {
    id: 'powerup-3',
    name: 'Time Freeze',
    description: 'Tambah waktu 30 menit di try out',
    category: 'powerup',
    price: 2500,
    icon: 'Clock',
    duration: 'Sekali pakai',
    rarity: 'rare'
  },
  // Badges
  {
    id: 'badge-1',
    name: 'Study Master',
    description: 'Badge untuk pelajar rajin',
    category: 'badge',
    price: 1000,
    icon: 'Trophy',
    rarity: 'common'
  },
  {
    id: 'badge-2',
    name: 'Quiz Champion',
    description: 'Badge juara kuis',
    category: 'badge',
    price: 2000,
    icon: 'Crown',
    rarity: 'rare'
  },
  {
    id: 'badge-3',
    name: 'Legend Scholar',
    description: 'Badge legendaris untuk scholar sejati',
    category: 'badge',
    price: 5000,
    icon: 'Sparkles',
    rarity: 'legendary'
  }
];

export class ShopController {
  // Get all shop items
  static async getShopItems(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { category } = request.query as { category?: string };
      
      let items = SHOP_ITEMS;
      if (category) {
        items = SHOP_ITEMS.filter(item => item.category === category);
      }
      
      reply.send({
        success: true,
        items: items
      });
    } catch (error) {
      console.error('Error fetching shop items:', error);
      reply.status(500).send({
        error: 'Failed to fetch shop items'
      });
    }
  }

  // Get user's purchased items
  static async getUserInventory(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;
      
      const user = await db.select({
        purchasedItems: users.purchased_items
      }).from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user[0]) {
        return reply.status(404).send({ error: 'User not found' });
      }
      
      const purchasedItems = user[0].purchasedItems || [];
      
      reply.send({
        success: true,
        purchasedItems
      });
    } catch (error) {
      console.error('Error fetching user inventory:', error);
      reply.status(500).send({
        error: 'Failed to fetch user inventory'
      });
    }
  }

  // Purchase an item
  static async purchaseItem(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { itemId } = request.params as { itemId: string };
      const userId = (request as any).user.userId;
      
      // Find the item
      const item = SHOP_ITEMS.find(i => i.id === itemId);
      if (!item) {
        return reply.status(404).send({ error: 'Item not found' });
      }
      
      // Get user data
      const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
      if (!user[0]) {
        return reply.status(404).send({ error: 'User not found' });
      }
      
      const userData = user[0];
      const currentCoins = userData.coins || 0;
      const purchasedItems = userData.purchased_items || [];
      
      // Check if user already owns the item
      if (purchasedItems.includes(itemId)) {
        return reply.status(400).send({ error: 'You already own this item' });
      }
      
      // Check if user has enough coins
      if (currentCoins < item.price) {
        return reply.status(400).send({ error: 'Insufficient coins' });
      }
      
      // Perform the purchase
      const newCoins = currentCoins - item.price;
      const newPurchasedItems = [...purchasedItems, itemId];
      
      await db.update(users)
        .set({
          coins: newCoins,
          purchased_items: newPurchasedItems
        })
        .where(eq(users.id, userId));
      
      // Send real-time notification
      socketService.emitToUser(userId, 'purchase:success', {
        itemId,
        itemName: item.name,
        price: item.price,
        newCoins,
        message: `Successfully purchased ${item.name}!`
      });
      
      reply.send({
        success: true,
        message: 'Item purchased successfully',
        item: {
          id: item.id,
          name: item.name,
          price: item.price
        },
        newCoins,
        purchasedItems: newPurchasedItems
      });
    } catch (error) {
      console.error('Error purchasing item:', error);
      reply.status(500).send({
        error: 'Failed to purchase item'
      });
    }
  }

  // Get user's coins
  static async getUserCoins(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request as any).user.userId;
      
      const user = await db.select({
        coins: users.coins
      }).from(users).where(eq(users.id, userId)).limit(1);
      
      if (!user[0]) {
        return reply.status(404).send({ error: 'User not found' });
      }
      
      reply.send({
        success: true,
        coins: user[0].coins || 0
      });
    } catch (error) {
      console.error('Error fetching user coins:', error);
      reply.status(500).send({
        error: 'Failed to fetch user coins'
      });
    }
  }
}