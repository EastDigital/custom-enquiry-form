
export type SubService = {
  id: string;
  name: string;
  price: number;
  unit?: string;
  minimumUnits?: number;
};

export type ServiceCategory = {
  id: string;
  name: string;
  subServices: SubService[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "branding",
    name: "Branding",
    subServices: [
      {
        id: "logo-design",
        name: "Logo Design",
        price: 100,
      },
      {
        id: "website-ui-design",
        name: "Website UI Design",
        price: 300,
      },
    ],
  },
  {
    id: "digital-campaigns",
    name: "Digital Campaigns",
    subServices: [
      {
        id: "website-development",
        name: "Website Development",
        price: 500,
      },
      {
        id: "app-development",
        name: "App Development",
        price: 800,
      },
      {
        id: "ppc-management",
        name: "PPC Management",
        price: 400,
      },
    ],
  },
  {
    id: "3d-renderings",
    name: "3D Renderings",
    subServices: [
      {
        id: "residential-rendering",
        name: "Residential Rendering",
        price: 600,
      },
      {
        id: "commercial-rendering",
        name: "Commercial Rendering",
        price: 800,
      },
    ],
  },
  {
    id: "3d-walkthroughs",
    name: "3D Walkthroughs",
    subServices: [
      {
        id: "residential-walkthrough",
        name: "Residential Walkthrough",
        price: 1000,
        unit: "per minute",
        minimumUnits: 3,
      },
      {
        id: "commercial-walkthrough",
        name: "Commercial Walkthrough",
        price: 1200,
        unit: "per minute",
        minimumUnits: 3,
      },
    ],
  },
];
