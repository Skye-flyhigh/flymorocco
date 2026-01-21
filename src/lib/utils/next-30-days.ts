/**
 * Returns the date in 30 days from now
 * @returns the date in 30 days
 */
function next30Days(): string {
  const now = new Date()
  const next30Days = now.getTime() + 30 * 24 * 60 * 60 * 1000
  const next30DaysDate: Date = new Date(next30Days);
    const formattedDate: string = next30DaysDate.toISOString().split('T')[0]; // YYYY-MM-DD format
    
    return formattedDate  
}

export { next30Days };
