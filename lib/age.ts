/**
 * Calculates the current age based on a birthdate
 * @param birthdate - The birthdate as a Date object or date string
 * @returns The current age in years
 */
export function calculateAge(birthdate: Date | string): number {
  const birth = typeof birthdate === 'string' ? new Date(birthdate) : birthdate;
  const today = new Date();
  
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  // If the birthday hasn't occurred this year yet, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Gets Nicolas Klein's current age
 * @returns The current age of Nicolas Klein
 */
export function getNicolasAge(): number {
  const birthdate = new Date('1998-10-05');
  return calculateAge(birthdate);
} 