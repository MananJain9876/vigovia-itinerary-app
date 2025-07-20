import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// Main App component
const App = () => {
  // State to manage the visibility of the PDF generation message
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  // Ref to the content that needs to be converted to PDF
  const contentRef = useRef(null);

  // Vigovia brand colors based on the provided image
  const colors = {
    ctaButton: '#541C9C',
    hoverEffect: '#680099',
    fillGradient: '#936FE0',
    boxFill: '#321E5D',
    chatColor: '#FBF4FF',
  };

  // Function to handle PDF download
  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true); // Show loading message
    const element = contentRef.current; // Get the content element

    if (element) {
      try {
        // Check if html2canvas and jsPDF are available globally
        if (typeof window.html2canvas === 'undefined' || typeof window.jspdf === 'undefined') {
          console.error('html2canvas or jspdf not loaded. Please ensure their CDN scripts are included in the HTML.');
          // In a real application, you might show a user-friendly message box here instead of an alert.
          setIsGeneratingPdf(false);
          return;
        }

        // Use html2canvas to capture the content as an image
        const canvas = await window.html2canvas(element, { scale: 2 }); // Scale for better quality
        const imgData = canvas.toDataURL('image/png'); // Convert canvas to data URL

        // Initialize jsPDF
        const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4'); // Portrait, millimeters, A4 size
        const imgWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate image height to maintain aspect ratio
        let heightLeft = imgHeight;
        let position = 0;

        // Add the image to the PDF, handling multiple pages if content is long
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('Vigovia_Itinerary.pdf'); // Save the PDF
      } catch (error) {
        console.error('Error generating PDF:', error);
        // In a real app, you might show an error message to the user
      } finally {
        setIsGeneratingPdf(false); // Hide loading message
      }
    }
  };

  // Vigovia Logo component
  const VigoviaLogo = () => (
    <div className="flex items-center justify-center flex-col md:flex-row">
      <div className="flex items-center">
        <span className="text-4xl font-bold text-[#321E5D]">vig</span>
        <span className="text-4xl font-bold text-[#936FE0]">ovia</span>
      </div>
      <div className="flex items-center text-sm text-gray-600 mt-1 md:mt-0 md:ml-2">
        <span className="tracking-widest">PLAN.PACK.GO</span>
        {/* Airplane SVG icon */}
        <svg
          className="ml-1"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#321E5D"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 16.92v3H2v-3L10 12l12 4.92zM2 16.92L10 12l12 4.92" />
          <path d="M12 12v-2l-2-2h-4l-2 2v2l2 2h4l2-2z" />
        </svg>
      </div>
    </div>
  );

  // Itinerary Header component
  const ItineraryHeader = () => (
    <div className="bg-gradient-to-r from-[#541C9C] to-[#936FE0] p-6 rounded-t-lg shadow-md text-white text-center">
      <p className="text-lg mb-2">Hi, Rahul!</p>
      <h1 className="text-3xl font-bold mb-2">Singapore Itinerary</h1>
      <p className="text-xl">6 Days 5 Nights</p>
      <div className="flex justify-center space-x-4 mt-4 text-2xl">
        {/* Placeholder icons - replace with actual icons if available in Figma */}
        <span>&#x1F304;</span> {/* Sunrise */}
        <span>&#x1F3D6;</span> {/* Beach */}
        <span>&#x1F303;</span> {/* Night */}
        <span>&#x1F3E2;</span> {/* Building */}
        <span>&#x1F307;</span> {/* Sunset */}
      </div>
    </div>
  );

  // Itinerary Details Table component
  const ItineraryDetailsTable = () => (
    <div className="bg-white p-4 rounded-b-lg shadow-md overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">Departure From</th>
            <th className="py-2 px-4 font-semibold text-gray-700">Departure</th>
            <th className="py-2 px-4 font-semibold text-gray-700">Arrival</th>
            <th className="py-2 px-4 font-semibold text-gray-700">Destination</th>
            <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">No. Of Travellers</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="py-2 px-4 border-b border-gray-200">Kolkata</td>
            <td className="py-2 px-4 border-b border-gray-200">09/06/2025</td>
            <td className="py-2 px-4 border-b border-gray-200">15/06/2025</td>
            <td className="py-2 px-4 border-b border-gray-200">Singapore</td>
            <td className="py-2 px-4 border-b border-gray-200">4</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  // Daily Itinerary Item component
  const DailyItineraryItem = ({ day, date, activities }) => (
    <div className="flex flex-col md:flex-row items-start md:items-center my-6">
      {/* Day label */}
      <div className="bg-[#541C9C] text-white p-3 rounded-l-lg flex-shrink-0 w-24 text-center mb-4 md:mb-0">
        <span className="block font-bold text-lg">{day}</span>
      </div>
      {/* Itinerary content */}
      <div className="flex-grow bg-white p-4 rounded-r-lg shadow-md ml-0 md:ml-4 w-full">
        <div className="flex flex-col md:flex-row md:items-center mb-4">
          <img
            src={`https://placehold.co/150x100/${colors.fillGradient.substring(1)}/FFFFFF?text=Image`}
            alt="Itinerary"
            className="rounded-lg mr-4 mb-4 md:mb-0 flex-shrink-0"
          />
          <div>
            <p className="font-semibold text-lg text-[#321E5D]">{date}</p>
            <p className="text-gray-600">Arrival in Singapore & City Exploration</p>
          </div>
        </div>
        {/* Activities list */}
        <ul className="list-none p-0">
          {activities.map((activity, index) => (
            <li key={index} className="flex items-start mb-2">
              <div className="w-4 h-4 rounded-full bg-[#936FE0] flex-shrink-0 mt-1 mr-3"></div>
              <div>
                <p className="font-semibold text-[#321E5D]">{activity.time}</p>
                <ul className="list-disc list-inside ml-4 text-gray-700">
                  {activity.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  // Flight Summary component
  const FlightSummary = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Flight Summary</h2>
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => ( // Render 3 flight entries as per image
          <div key={index} className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
            <span className="text-lg font-semibold text-[#541C9C] mr-4">Thu 10 Jan'24</span>
            <div className="flex items-center flex-grow">
              <span className="text-gray-700 font-medium">Fly Air India</span>
              <svg
                className="mx-2"
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              <span className="text-gray-700">From Delhi (DEL) To Singapore (SIN).</span>
            </div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-4">
        Note: All Flights Include Meals, Seat Choice (Excluding XL), And 20kg/25kg Checked Baggage.
      </p>
    </div>
  );

  // Hotel Bookings component
  const HotelBookings = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Hotel Bookings</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">City</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Check In</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Check Out</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Nights</th>
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">Hotel Name</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => ( // Render 5 hotel entries as per image
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200">Singapore</td>
                <td className="py-2 px-4 border-b border-gray-200">24/02/2024</td>
                <td className="py-2 px-4 border-b border-gray-200">24/02/2024</td>
                <td className="py-2 px-4 border-b border-gray-200">2</td>
                <td className="py-2 px-4 border-b border-gray-200">Super Townhouse Oak Vashi Formerly Blue Diamond</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="text-sm text-gray-500 mt-4 list-disc list-inside space-y-1">
        <li>All Hotels Are Tentative And Can Be Replaced With Similar.</li>
        <li>Breakfast Included For All Hotel Stays.</li>
        <li>All Room Will Be As Per Deluxe Category.</li>
        <li>A maximum occupancy of 2 people/room is allowed in most hotels.</li>
      </ul>
    </div>
  );

  // Scope of Service component
  const ScopeOfService = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Scope Of Service</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Service Table */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-[#541C9C] mb-2">Service</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Flight Tickets And Hotel Vouchers</li>
            <li>Web Check-in</li>
            <li>Support</li>
            <li>Cancellation Support</li>
            <li>Trip Support</li>
          </ul>
        </div>
        {/* Details Table */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-[#541C9C] mb-2">Details</h3>
          <ul className="space-y-2 text-gray-700">
            <li>Delivered 3 Days Post Full Payment</li>
            <li>Boarding Pass Delivery Via Email/WhatsApp</li>
            <li>Chat Support – Response Time: 4 Hours</li>
            <li>Provided</li>
            <li>Response Time: 5 Minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Inclusion Summary component
  const InclusionSummary = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Inclusion Summary</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">Category</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Count</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Details</th>
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">Status / Comments</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Flight</td>
              <td className="py-2 px-4 border-b border-gray-200">2</td>
              <td className="py-2 px-4 border-b border-gray-200">All Flights Mentioned</td>
              <td className="py-2 px-4 border-b border-gray-200">Awaiting Confirmation</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Tourist Tax</td>
              <td className="py-2 px-4 border-b border-gray-200">2</td>
              <td className="py-2 px-4 border-b border-gray-200">Yotel (Singapore), Oakwood (Sydney), Mercure (Cairns), Novotel (Gold Coast), Holiday Inn (Melbourne)</td>
              <td className="py-2 px-4 border-b border-gray-200">Awaiting Confirmation</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Hotel</td>
              <td className="py-2 px-4 border-b border-gray-200">2</td>
              <td className="py-2 px-4 border-b border-gray-200">Airport To Hotel - Hotel To Attractions - Day Trips If Any</td>
              <td className="py-2 px-4 border-b border-gray-200">Included</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="text-sm text-gray-500 mt-4">
        <span className="font-semibold">Transfer Policy(Refundable Upon Claim):</span> If Any Transfer Is Delayed Beyond 15 Minutes, Customers May Book An App-Based Or Radio Taxi And Claim A Refund For That Specific Leg.
      </p>
    </div>
  );

  // Activity Table component
  const ActivityTable = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Activity Table</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">City</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Activity</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Type</th>
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">Time Required</th>
            </tr>
          </thead>
          <tbody>
            {[...Array(10)].map((_, index) => ( // Render multiple entries as per image
              <tr key={index}>
                <td className="py-2 px-4 border-b border-gray-200">Rio De Janeiro</td>
                <td className="py-2 px-4 border-b border-gray-200">Sydney Harbour Cruise & Taronga Zoo</td>
                <td className="py-2 px-4 border-b border-gray-200">Nature/Sightseeing</td>
                <td className="py-2 px-4 border-b border-gray-200">2-3 Hours</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Payment Plan component
  const PaymentPlan = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Payment Plan</h2>
      <div className="space-y-4">
        <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="text-lg font-semibold text-[#541C9C] mr-4">Total Amount</span>
          <div className="flex items-center flex-grow">
            <span className="text-gray-700 font-medium">₹ 9,00,000</span>
            <span className="ml-2 text-gray-500">For 3 Pax (Inclusive Of GST)</span>
          </div>
        </div>
        <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="text-lg font-semibold text-[#541C9C] mr-4">TCS</span>
          <div className="flex items-center flex-grow">
            <span className="text-gray-700 font-medium">Not Collected</span>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto mt-6">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">Installment</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Amount</th>
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Installment 1</td>
              <td className="py-2 px-4 border-b border-gray-200">₹3,50,000</td>
              <td className="py-2 px-4 border-b border-gray-200">Initial Payment</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Installment 2</td>
              <td className="py-2 px-4 border-b border-gray-200">₹4,00,000</td>
              <td className="py-2 px-4 border-b border-gray-200">Post Visa Approval</td>
            </tr>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Installment 3</td>
              <td className="py-2 px-4 border-b border-gray-200">Remaining</td>
              <td className="py-2 px-4 border-b border-gray-200">20 Days Before Departure</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Visa Details component
  const VisaDetails = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Visa Details</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tl-lg">Visa Type :</th>
              <th className="py-2 px-4 font-semibold text-gray-700">Validity:</th>
              <th className="py-2 px-4 font-semibold text-gray-700 rounded-tr-lg">Processing Date :</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="py-2 px-4 border-b border-gray-200">Tourist</td>
              <td className="py-2 px-4 border-b border-gray-200">30 Days</td>
              <td className="py-2 px-4 border-b border-gray-200">14/06/2025</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  // Terms and Conditions component (simplified as per image)
  const TermsAndConditions = () => (
    <div className="bg-white p-6 rounded-lg shadow-md my-6">
      <h2 className="text-2xl font-bold text-[#321E5D] mb-4">Terms and Conditions</h2>
      <a href="#" className="text-[#541C9C] hover:underline">View all terms and conditions</a>
    </div>
  );

  // Footer component
  const Footer = () => (
    <footer className="bg-white p-6 mt-8 rounded-lg shadow-md text-center text-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <div className="text-left mb-4 md:mb-0">
          <p className="font-semibold">Vigovia Tech Pvt Ltd</p>
          <p className="text-sm">Registered Office: Hd-109 Cinnabar Hills,</p>
          <p className="text-sm">Links Business Park, Karnataka, India.</p>
        </div>
        <div className="text-center mb-4 md:mb-0">
          <p className="text-sm">Phone: +91-99X9999999</p>
          <p className="text-sm">Email ID: Contact@Vigovia.Com</p>
        </div>
        <VigoviaLogo /> {/* Reusing the logo component */}
      </div>
      <p className="text-lg font-bold text-[#321E5D] mt-4">PLAN.PACK.GO!</p>
      <button
        className="bg-[#541C9C] hover:bg-[#680099] text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out mt-4"
        style={{
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
          background: `linear-gradient(to right, ${colors.ctaButton}, ${colors.fillGradient})`
        }}
      >
        Book Now
      </button>
    </footer>
  );


  return (
    <div className="min-h-screen bg-[#FBF4FF] font-sans text-gray-800 p-4 sm:p-6 lg:p-8">
      {/* Container for the entire itinerary content to be captured for PDF */}
      <div ref={contentRef} className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}
        <ItineraryHeader />
        <ItineraryDetailsTable />

        {/* Daily Itinerary */}
        <div className="p-6">
          <DailyItineraryItem
            day="Day 1"
            date="27th November"
            activities={[
              { time: 'Morning', details: ['Arrive in Singapore. Transfer From Airport To Hotel.'] },
              { time: 'Afternoon', details: ['Check Into Your Hotel.', 'Visit Marina Bay Sands Sky Park (2-3 Hours)', 'Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.'] },
              { time: 'Evening', details: ['Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'] },
            ]}
          />
          <DailyItineraryItem
            day="Day 2"
            date="27th November"
            activities={[
              { time: 'Morning', details: ['Arrive in Singapore. Transfer From Airport To Hotel.'] },
              { time: 'Afternoon', details: ['Check Into Your Hotel.', 'Visit Marina Bay Sands Sky Park (2-3 Hours)', 'Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.'] },
              { time: 'Evening', details: ['Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'] },
            ]}
          />
          <DailyItineraryItem
            day="Day 3"
            date="27th November"
            activities={[
              { time: 'Morning', details: ['Arrive in Singapore. Transfer From Airport To Hotel.'] },
              { time: 'Afternoon', details: ['Check Into Your Hotel.', 'Visit Marina Bay Sands Sky Park (2-3 Hours)', 'Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.'] },
              { time: 'Evening', details: ['Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'] },
            ]}
          />
          <DailyItineraryItem
            day="Day 4"
            date="27th November"
            activities={[
              { time: 'Morning', details: ['Arrive in Singapore. Transfer From Airport To Hotel.'] },
              { time: 'Afternoon', details: ['Check Into Your Hotel.', 'Visit Marina Bay Sands Sky Park (2-3 Hours)', 'Optional: Stroll Along Marina Bay Waterfront Promenade Or Helix Bridge.'] },
              { time: 'Evening', details: ['Explore Gardens By The Bay, Including Super Tree Grove (3-4 Hours)'] },
            ]}
          />
        </div>

        {/* Other Sections */}
        <div className="p-6">
          <FlightSummary />
          <HotelBookings />
          <ScopeOfService />
          <InclusionSummary />
          <ActivityTable />
          <PaymentPlan />
          <VisaDetails />
          <TermsAndConditions />
        </div>

        {/* Footer */}
        <Footer />
      </div>

      {/* PDF Download Button and Loading Indicator */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleDownloadPdf}
          className="bg-[#541C9C] hover:bg-[#680099] text-white font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out"
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
            background: `linear-gradient(to right, ${colors.ctaButton}, ${colors.fillGradient})`
          }}
          disabled={isGeneratingPdf}
        >
          {isGeneratingPdf ? 'Generating PDF...' : 'Download Itinerary as PDF'}
        </button>
      </div>

      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-[#541C9C]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg text-gray-700">Please wait, generating your PDF...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
