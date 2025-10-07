import bcrypt from 'bcrypt'
export async function hashPassword(p){
  const saltRounds = 10
  return bcrypt.hash(p, saltRounds)
}
