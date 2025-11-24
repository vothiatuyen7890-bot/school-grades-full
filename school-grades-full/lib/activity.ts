import prisma from './prisma';

export async function logActivity(userId:string, action:string, meta?:any){
  try {
    await prisma.activity.create({ data: { userId, action, meta }});
  } catch(e){
    console.error('Failed to log activity', e);
  }
}
