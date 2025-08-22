export function generateBookingRef(bookingDate: Date) {
    const date = new Date(bookingDate);
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    // Get booking count for this date to make unique reference
    const dailySequence = getDailyBookingCount(bookingDate).toString().padStart(2, '0');

    return `FM${year}${month}${day}${dailySequence}`;
}

function getDailyBookingCount(date: Date) {
    // This function should return the number of bookings for the given date

    return date;
}