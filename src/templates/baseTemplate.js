import config from "../config/index.js";

export const generatePageTemplate = (
  content,
  title = "",
  needsPageBreak = false,
  avoidBreak = false
) => {
  return `
    <div class="${needsPageBreak ? "page-break" : ""} ${
    avoidBreak ? "avoid-break avoid-break-border" : ""
  }">
      ${content}
    </div>
  `;
};


export const generateTailwindHTML = (content) => {

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Miscellaneous PI Proposal Form</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script>
          tailwind.config = {
              theme: {
                  extend: {
                      colors: {
                          primary: '#596efe',
                          'black-300': '#4a4a4a'
                      }
                  }
              }
          }
      </script>
      <style>
          @page {
              size: A4;
              margin: 8mm;
              
          }
          
          /* Page template that repeats on every page */
          @media print {
              body {
                  background: white;
                  -webkit-print-color-adjust: exact;
                  print-color-adjust: exact;
              }
              
              .page-break { 
                  page-break-before: always; 
                  break-before: page;
              }
              
              
              /* Page template background and border */
              body::before {
                  content: "";
                  position: fixed;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  background-image: url('${
                    config.server.serverUrl
                  }/src/assets/images/mainContent.png');
                  background-repeat: no-repeat;
                  background-position: center;
                  background-size: 720px auto;
                  z-index: -2;
              }
              
              body::after {
                  content: "";
                  position: fixed;
                  top: 0mm;
                  left: 0mm;
                  right: 0mm;
                  bottom: 0mm;
                  z-index: -1;
              }
              
          }
          
          /* Screen styles */
          .step-content {
              max-width: 800px;
              margin: 0 auto;
              padding: 40px;
              position: relative;
              z-index: 1;
              display: flex;
              flex-direction: column;
              gap: 20px;
          }

          .avoid-break {
            break-inside: avoid;
          }

          .avoid-break-border {
            -webkit-box-decoration-break: clone;
            box-decoration-break: clone;
            padding: 50px 40px !important;
          }
      </style>
  </head>
  <body class="bg-white font-sans text-sm leading-relaxed">
      <!-- Screen header (hidden in print) -->
      <div class="print:hidden text-center py-6 mb-8">
        <img src="${
          config.server.serverUrl
        }/src/assets/images/mainContent.png" 
             class="w-[82px] h-auto mx-auto mb-4" alt="Logo" />
      </div>

      ${content}
  </body>
  </html>`;
};



export default {
  generatePageTemplate,
  generateTailwindHTML,
};

