import { useState } from "react";

export default function PilotDetails({formData, errors}) {

      const [isPilot, setIsPilot] = useState<boolean>(false);

      const pilotFields = [
        { name: 'gliderManufacturer', label: 'Glider Manufacturer'},
        { name: 'gliderModel', label: 'Glider Model'},
        { name: 'gliderSize', label: 'Glider size'},
        { name: 'gliderColours', label: 'Glider colours'}
      ]
    
      return (
        <>
             <div className="flex gap-1">
                  <label htmlFor="pilot" className="fieldset-label mr-4">
                    Bringing your paraglider with you?
                  </label>
                  <input
                    type="checkbox"
                    name="pilot"
                    id="pilot"
                    onClick={() => setIsPilot(!isPilot)}
                    aria-expanded={isPilot}
            aria-controls="glider-details"
                  />
                  <label htmlFor="pilot">Yes</label>
                </div>
              <fieldset
                className={`fieldset transition-all overflow-hidden duration-750 ease-in-out ${isPilot ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}
                aria-hidden={!isPilot}
                id="glider-details"
              >
                <legend className="fieldset-legend">Glider details</legend>
                {pilotFields.map(({ name, label }) => (
                  <div key={name}>
                    <label htmlFor={name} className="fieldset-label">
                      {label}
                    </label>
                    <input type="text" name={name} id={name} className="input" defaultValue={formData.name} />
                  </div>
                ))}
              </fieldset>
        </>
                   
      )
}