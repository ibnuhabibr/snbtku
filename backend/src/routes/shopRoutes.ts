import { FastifyInstance } from 'fastify';
import { ShopController } from '../controllers/shopController';
import { authMiddleware } from '../middleware/authMiddleware';

export async function shopRoutes(fastify: FastifyInstance) {
  // Get all shop items
  fastify.get('/api/v1/shop/items', {
    schema: {
      description: 'Get all shop items',
      tags: ['Shop'],
      querystring: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            enum: ['avatar', 'badge', 'powerup'],
            description: 'Filter items by category'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  description: { type: 'string' },
                  category: { type: 'string' },
                  price: { type: 'number' },
                  rarity: { type: 'string' },
                  image: { type: 'string' },
                  icon: { type: 'string' },
                  duration: { type: 'string' }
                }
              }
            }
          }
        }
      }
    }
  }, ShopController.getShopItems);

  // Get user's inventory (purchased items)
  fastify.get('/api/v1/shop/inventory', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get user inventory',
      tags: ['Shop'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            purchasedItems: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, ShopController.getUserInventory);

  // Purchase an item
  fastify.post('/api/v1/shop/purchase/:itemId', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Purchase a shop item',
      tags: ['Shop'],
      security: [{ bearerAuth: [] }],
      params: {
        type: 'object',
        required: ['itemId'],
        properties: {
          itemId: {
            type: 'string',
            description: 'ID of the item to purchase'
          }
        }
      },
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            message: { type: 'string' },
            item: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                price: { type: 'number' }
              }
            },
            newCoins: { type: 'number' },
            purchasedItems: {
              type: 'array',
              items: { type: 'string' }
            }
          }
        },
        400: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, ShopController.purchaseItem);

  // Get user's coins
  fastify.get('/api/v1/shop/coins', {
    preHandler: [authMiddleware],
    schema: {
      description: 'Get user coins',
      tags: ['Shop'],
      security: [{ bearerAuth: [] }],
      response: {
        200: {
          type: 'object',
          properties: {
            success: { type: 'boolean' },
            coins: { type: 'number' }
          }
        },
        401: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        },
        404: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    }
  }, ShopController.getUserCoins);
}