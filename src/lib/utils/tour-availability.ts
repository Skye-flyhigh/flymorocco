import { TourSchedule } from "../validation/tourScheduleData";
import { next30Days, nextXDays } from "./next-30-days";



type Availability = "available" | "full" | "limited"

function tourAvailability(
    tour: TourSchedule): Availability {
    
    // Catches tours starting in less than 30 days and mark then as full
    if (new Date(next30Days()) > new Date(tour.start)) return "full"
    
    // any tours within 60 days of the start should return limited but not overwrite the tours that are already full
    if (new Date(tour.start) < new Date(nextXDays(60)) && tour.status !== "full") return "limited"

    return tour.status as Availability
}

function availabilityStyling(status: Availability): string {
    switch (status) {
        case "available":
            return "badge-success bg-green-100 group-hover:bg-green-200 dark:text-green-100 dark:bg-green-700 dark:group-hover:bg-green-800"
        case "full":
            return "badge-error bg-red-100 group-hover:bg-red-200 dark:text-red-100 dark:bg-red-700 dark:group-hover:bg-red-800"
        case "limited":
            return "badge-warning bg-yellow-100 group-hover:bg-yellow-200 dark:text-yellow-100 dark:bg-yellow-700 dark:group-hover:bg-yellow-800"
    }
}

export { availabilityStyling, tourAvailability };

