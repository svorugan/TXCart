module.exports = [
  {
    id: "xray-standard",
    name: "Standard X-Ray",
    description: "Basic radiographic imaging to visualize bone structure and some soft tissues",
    price: 1200,
    duration: 15, // in minutes
    preparationRequired: false,
    reportTime: 1, // time in hours to get the report
    category: "Imaging",
    recommended: true
  },
  {
    id: "xray-weight-bearing",
    name: "Weight-Bearing X-Ray",
    description: "X-ray taken while standing to assess joint alignment under natural load",
    price: 1800,
    duration: 20,
    preparationRequired: false,
    reportTime: 1,
    category: "Imaging",
    recommended: true
  },
  {
    id: "mri-standard",
    name: "MRI Scan",
    description: "Detailed magnetic resonance imaging to visualize soft tissues, ligaments, and cartilage",
    price: 8000,
    duration: 45,
    preparationRequired: true,
    preparationInstructions: "Remove all metal objects. Inform technician of any implants or medical devices.",
    reportTime: 24,
    category: "Imaging",
    recommended: true
  },
  {
    id: "mri-contrast",
    name: "MRI with Contrast",
    description: "Enhanced MRI using contrast agent for better visualization of certain tissues",
    price: 12000,
    duration: 60,
    preparationRequired: true,
    preparationInstructions: "Fast for 4 hours before the procedure. Remove all metal objects.",
    reportTime: 24,
    category: "Imaging",
    recommended: false
  },
  {
    id: "ct-standard",
    name: "CT Scan",
    description: "Computed tomography scan providing cross-sectional images of bones and joints",
    price: 5000,
    duration: 30,
    preparationRequired: false,
    reportTime: 6,
    category: "Imaging",
    recommended: false
  },
  {
    id: "ct-contrast",
    name: "CT Scan with Contrast",
    description: "Enhanced CT scan using contrast agent for better visualization",
    price: 7500,
    duration: 45,
    preparationRequired: true,
    preparationInstructions: "Fast for 4 hours before the procedure. Inform technician of any allergies.",
    reportTime: 6,
    category: "Imaging",
    recommended: false
  },
  {
    id: "bone-density",
    name: "Bone Density Test (DEXA)",
    description: "Measures bone mineral density to assess bone strength and osteoporosis risk",
    price: 3000,
    duration: 20,
    preparationRequired: false,
    reportTime: 24,
    category: "Screening",
    recommended: true
  },
  {
    id: "arthroscopy-diagnostic",
    name: "Diagnostic Arthroscopy",
    description: "Minimally invasive procedure using a camera to directly visualize joint structures",
    price: 15000,
    duration: 60,
    preparationRequired: true,
    preparationInstructions: "Fast for 8 hours before the procedure. Stop blood thinners as advised by doctor.",
    reportTime: 1,
    category: "Procedure",
    recommended: false
  },
  {
    id: "ultrasound-joint",
    name: "Joint Ultrasound",
    description: "Non-invasive imaging using sound waves to visualize soft tissues and fluid",
    price: 2500,
    duration: 30,
    preparationRequired: false,
    reportTime: 2,
    category: "Imaging",
    recommended: true
  },
  {
    id: "blood-rheumatoid",
    name: "Rheumatoid Factor Test",
    description: "Blood test to detect rheumatoid factor, an indicator of rheumatoid arthritis",
    price: 1500,
    duration: 10,
    preparationRequired: true,
    preparationInstructions: "Fast for 8 hours before the blood draw.",
    reportTime: 48,
    category: "Laboratory",
    recommended: true
  },
  {
    id: "blood-inflammatory",
    name: "Inflammatory Markers Panel",
    description: "Blood tests measuring ESR, CRP and other markers of inflammation",
    price: 2000,
    duration: 10,
    preparationRequired: true,
    preparationInstructions: "Fast for 8 hours before the blood draw.",
    reportTime: 48,
    category: "Laboratory",
    recommended: true
  },
  {
    id: "synovial-fluid",
    name: "Synovial Fluid Analysis",
    description: "Extraction and analysis of joint fluid to detect infection, inflammation, or crystal deposits",
    price: 4500,
    duration: 30,
    preparationRequired: true,
    preparationInstructions: "Inform doctor of any blood thinners you are taking.",
    reportTime: 72,
    category: "Laboratory",
    recommended: false
  },
  {
    id: "gait-analysis",
    name: "Computerized Gait Analysis",
    description: "Assessment of walking pattern using sensors and cameras to detect abnormalities",
    price: 5500,
    duration: 60,
    preparationRequired: true,
    preparationInstructions: "Wear comfortable clothing and walking shoes.",
    reportTime: 48,
    category: "Functional",
    recommended: true
  },
  {
    id: "range-motion",
    name: "Range of Motion Assessment",
    description: "Detailed measurement of joint mobility and flexibility",
    price: 1800,
    duration: 45,
    preparationRequired: false,
    reportTime: 1,
    category: "Functional",
    recommended: true
  },
  {
    id: "muscle-strength",
    name: "Muscle Strength Testing",
    description: "Quantitative assessment of muscle strength around affected joints",
    price: 2000,
    duration: 45,
    preparationRequired: false,
    reportTime: 1,
    category: "Functional",
    recommended: true
  }
];
