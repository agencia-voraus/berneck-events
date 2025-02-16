import { Prisma } from '@prisma/client'

prisma.$use(async (params, next) => {
  if (params.model == 'Gift' && params.action == 'update') {
    const updatedGift = params.args.data;
    if (updatedGift.hasClaimed === true) {
      updatedGift.claimedAt = new Date();
    }
  }
  return next(params);
});