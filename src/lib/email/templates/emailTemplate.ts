export interface EmailTemplateProps {
  recipientName: string;
  content: string;
  footerContent?: string;
}

export function createEmailTemplate({
  recipientName,
  content,
  footerContent = "Flymorocco - Expert Paragliding Tours in Morocco",
}: EmailTemplateProps): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Flymorocco</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: Arial, sans-serif;">
      
      <!-- Email Container -->
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        
        <!-- Header Banner -->
        <div style="padding: 0;">
          <a href="https://flymorocco.info/tours" style="display: block; text-decoration: none;">
            <img src="https://flymorocco.info/images/email-banner.jpg" 
                 alt="FlyMorocco - Choose your Vibes: Mountain, Coastal, Wellbeing Tours - Click to explore all tours" 
                 style="width: 100%; height: auto; display: block; max-height: 250px; object-fit: cover; transition: opacity 0.3s;">
          </a>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 30px 25px;">
          <h2 style="color: #2c5530; margin: 0 0 20px 0; font-size: 24px;">
            Hello ${recipientName}! 👋
          </h2>
          
          <div style="color: #333; line-height: 1.6; font-size: 16px;">
            ${content}
          </div>
        </div>
        
        <!-- Call-to-Action Section (if needed) -->
        <div style="padding: 0 25px 20px;">
          <div style="background: #e8f5e8; padding: 20px; border-radius: 6px; text-align: center;">
            <p style="margin: 0 0 15px 0; color: #2c5530; font-weight: bold;">
              🪂 Ready for Adventure?
            </p>
            <a href="https://flymorocco.info" 
               style="display: inline-block; background: #2c5530; color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; transition: all 0.3s;">
              Visit Flymorocco.info
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #2c5530; color: white; padding: 25px; text-align: center;">
          <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
            ${footerContent}
          </p>
          <p style="margin: 0 0 15px 0; font-size: 14px; opacity: 0.9;">
            Atlas Mountains • Atlantic Coast • Expert Guides
          </p>
          
          <!-- Social Links -->
          <div style="margin: 15px 0;">
            <a href="https://flymorocco.info" style="color: #90EE90; text-decoration: none; margin: 0 10px;">
              🌐 Website
            </a>
            <a href="https://flymorocco.info/tours" style="color: #90EE90; text-decoration: none; margin: 0 10px;">
              🪂 All Tours
            </a>
            <a href="mailto:contact@flymorocco.info" style="color: #90EE90; text-decoration: none; margin: 0 10px;">
              ✉️ Contact
            </a>
          </div>
          
          <!-- Legal Footer -->
          <div style="border-top: 1px solid rgba(255,255,255,0.2); padding-top: 15px; margin-top: 15px;">
            <p style="margin: 0; font-size: 12px; opacity: 0.7;">
              You received this email because you booked a tour with Flymorocco.<br>
              Flymorocco Tours • Morocco • contact@flymorocco.info
            </p>
          </div>
        </div>
        
      </div>
      
      <!-- Spacer for mobile -->
      <div style="height: 20px;"></div>
      
    </body>
    </html>
  `;
}
