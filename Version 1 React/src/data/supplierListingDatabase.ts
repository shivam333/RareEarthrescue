import { DashboardSourceId } from "./dashboardMarketplaceData";

export type MaterialComposition = {
  label: string;
  value: string;
};

export type ScrapPartRecord = {
  id: string;
  manufacturer: string;
  modelFamily: string;
  partNumber: string;
  typicalForm: string;
  composition: MaterialComposition[];
  pricingHint: string;
};

export type ScrapSubcategory = {
  id: string;
  label: string;
  guidance: string;
  partRecords: ScrapPartRecord[];
};

export type SupplyFamilyListingDatabase = {
  familyId: DashboardSourceId;
  familyLabel: string;
  lotExamples: string[];
  subcategories: ScrapSubcategory[];
};

export const supplierListingDatabase: SupplyFamilyListingDatabase[] = [
  {
    familyId: "hdd",
    familyLabel: "Hard Disc Drives",
    lotExamples: ["Whole HDD pallets", "Extracted magnet trays", "Damaged drive lots"],
    subcategories: [
      {
        id: "whole-hdd",
        label: "Whole HDDs",
        guidance: "Best for data-center decommissioning, ITAD sorting, and mixed enterprise lots.",
        partRecords: [
          {
            id: "hdd-seagate-exos",
            manufacturer: "Seagate",
            modelFamily: "Exos enterprise HDD",
            partNumber: "ST12000NM0127",
            typicalForm: "Whole drive with intact magnet assembly",
            composition: [
              { label: "NdFeB magnet material", value: "0.45-0.62%" },
              { label: "Aluminum / steel recovery", value: "78-84%" },
              { label: "PCB and mixed copper", value: "6-9%" },
            ],
            pricingHint: "Enterprise lots usually clear stronger when manifests and image packs are complete.",
          },
          {
            id: "hdd-wd-ultrastar",
            manufacturer: "Western Digital",
            modelFamily: "Ultrastar datacenter HDD",
            partNumber: "HUS728T8TALE6L4",
            typicalForm: "Whole drive with board attached",
            composition: [
              { label: "NdFeB magnet material", value: "0.42-0.59%" },
              { label: "Aluminum / steel recovery", value: "76-83%" },
              { label: "PCB and mixed copper", value: "7-10%" },
            ],
            pricingHint: "Board-attached inventory benefits from cleaner unit counts and pallet photos.",
          },
        ],
      },
      {
        id: "extracted-magnets",
        label: "Extracted magnets",
        guidance: "Higher concentration lots built from teardown programs and magnet separation.",
        partRecords: [
          {
            id: "hdd-toshiba-magnet-pack",
            manufacturer: "Toshiba",
            modelFamily: "MN-series teardown magnet pack",
            partNumber: "MN08ACA16T",
            typicalForm: "Loose magnet assemblies in trays or drums",
            composition: [
              { label: "NdFeB magnet material", value: "1.20-1.85%" },
              { label: "Low mixed-metal carryover", value: "8-14%" },
              { label: "Steel backing / adhesive", value: "14-20%" },
            ],
            pricingHint: "Separated magnets price better when adhesive contamination is documented clearly.",
          },
        ],
      },
      {
        id: "shredded-hdd",
        label: "Shredded HDD fractions",
        guidance: "Useful for larger mixed e-waste lanes where magnets are embedded in shredded fractions.",
        partRecords: [
          {
            id: "hdd-shred-mix",
            manufacturer: "Mixed OEM",
            modelFamily: "Shredded HDD shred mix",
            partNumber: "Mixed shred fraction",
            typicalForm: "Bulk shredded HDD fraction",
            composition: [
              { label: "NdFeB magnet material", value: "0.25-0.41%" },
              { label: "Ferrous and aluminum mix", value: "72-81%" },
              { label: "PCB / fines / other", value: "9-14%" },
            ],
            pricingHint: "Shredded lanes clear fastest when screen size and contamination notes are attached.",
          },
        ],
      },
    ],
  },
  {
    familyId: "auto-motors",
    familyLabel: "EV and Hybrid Motors",
    lotExamples: ["Traction motor cores", "Hybrid rotor packs", "E-bike motor pallets"],
    subcategories: [
      {
        id: "ev-traction",
        label: "EV traction motors",
        guidance: "Large-format traction assemblies with stronger buyer interest around repeat OEM streams.",
        partRecords: [
          {
            id: "auto-tesla-drive-unit",
            manufacturer: "Tesla",
            modelFamily: "Model 3 rear drive unit",
            partNumber: "1120990-00-J",
            typicalForm: "Whole drive unit or stripped motor",
            composition: [
              { label: "NdFeB magnet content", value: "1.4-2.2%" },
              { label: "Copper recovery", value: "7-12%" },
              { label: "Electrical steel / aluminum", value: "68-79%" },
            ],
            pricingHint: "Full drive units often price differently from stripped stator or rotor-only lots.",
          },
          {
            id: "auto-gm-ultium",
            manufacturer: "General Motors",
            modelFamily: "Ultium propulsion motor",
            partNumber: "GM-ULT-PM74",
            typicalForm: "Whole propulsion motor",
            composition: [
              { label: "NdFeB magnet content", value: "1.1-1.8%" },
              { label: "Copper recovery", value: "6-10%" },
              { label: "Electrical steel / aluminum", value: "70-80%" },
            ],
            pricingHint: "Photos showing opened housing and rotor condition help recyclers bid faster.",
          },
        ],
      },
      {
        id: "hybrid",
        label: "Hybrid motors",
        guidance: "Rotor-rich hybrid systems that combine magnet recovery with strong copper value.",
        partRecords: [
          {
            id: "auto-toyota-prius",
            manufacturer: "Toyota",
            modelFamily: "Prius hybrid motor generator",
            partNumber: "G9200-47120",
            typicalForm: "Hybrid drive motor or split drivetrain core",
            composition: [
              { label: "NdFeB magnet content", value: "0.9-1.4%" },
              { label: "Copper recovery", value: "8-13%" },
              { label: "Steel / aluminum", value: "69-77%" },
            ],
            pricingHint: "Hybrid lanes often outperform when rotor pack condition is documented.",
          },
        ],
      },
      {
        id: "ebike",
        label: "E-bike hub motors",
        guidance: "Smaller-format lots that bundle well for repeat micro-mobility recyclers.",
        partRecords: [
          {
            id: "auto-bosch-ebike",
            manufacturer: "Bosch",
            modelFamily: "Performance Line CX",
            partNumber: "BDU374Y",
            typicalForm: "Hub motor pallets or dismantled motor cores",
            composition: [
              { label: "NdFeB magnet content", value: "1.0-1.5%" },
              { label: "Copper recovery", value: "9-14%" },
              { label: "Aluminum / steel", value: "63-74%" },
            ],
            pricingHint: "Bundle counts and consistent OEM grouping improve bid confidence for small motors.",
          },
        ],
      },
    ],
  },
  {
    familyId: "industrial-motors",
    familyLabel: "Industrial Motors",
    lotExamples: ["Servo motors", "Appliance motors", "Wind-system units"],
    subcategories: [
      {
        id: "power-steering",
        label: "Power steering motors",
        guidance: "Useful for suppliers with dismantling access to automotive steering modules.",
        partRecords: [
          {
            id: "ind-jtekt-steering",
            manufacturer: "JTEKT",
            modelFamily: "EPS steering assist motor",
            partNumber: "EPS-2J34-9C",
            typicalForm: "Power steering motor core",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "0.8-1.2%" },
              { label: "Copper recovery", value: "7-10%" },
              { label: "Steel / aluminum", value: "73-81%" },
            ],
            pricingHint: "Steering motors move better when gear housing and electronics separation is consistent.",
          },
        ],
      },
      {
        id: "small-appliance",
        label: "Small appliance motors",
        guidance: "Smaller units that typically need batching by OEM or appliance type.",
        partRecords: [
          {
            id: "ind-dyson-v11",
            manufacturer: "Dyson",
            modelFamily: "Digital motor V11",
            partNumber: "DY-971426-01",
            typicalForm: "Separated appliance motor packs",
            composition: [
              { label: "NdFeB magnet fraction", value: "0.7-1.1%" },
              { label: "Copper recovery", value: "6-9%" },
              { label: "Mixed aluminum / polymer", value: "55-67%" },
            ],
            pricingHint: "Appliance motors need cleaner batching and photo evidence to avoid generic e-waste pricing.",
          },
        ],
      },
      {
        id: "servo",
        label: "Industrial-grade servo motors",
        guidance: "Higher-value industrial units with better traceability and repeat buyer demand.",
        partRecords: [
          {
            id: "ind-siemens-servo",
            manufacturer: "Siemens",
            modelFamily: "SIMOTICS S-1FK7",
            partNumber: "1FK7060-5AF71-1EG0",
            typicalForm: "Servo motor core with intact rotor",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "1.1-1.6%" },
              { label: "Copper recovery", value: "10-15%" },
              { label: "Steel / aluminum", value: "66-76%" },
            ],
            pricingHint: "Servo motor buyers respond well to nameplate photos and condition detail.",
          },
          {
            id: "ind-vestas-wind",
            manufacturer: "Vestas",
            modelFamily: "Wind turbine pitch / auxiliary motor",
            partNumber: "V112-PM-AUX",
            typicalForm: "Auxiliary wind-system motor",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "1.3-1.8%" },
              { label: "Copper recovery", value: "9-13%" },
              { label: "Steel / aluminum", value: "70-78%" },
            ],
            pricingHint: "Wind-system units need notes on dismantling stage and environmental exposure.",
          },
        ],
      },
    ],
  },
  {
    familyId: "mri",
    familyLabel: "MRI Machines",
    lotExamples: ["1.5T systems", "3T systems", "Open MRI dismantling lots"],
    subcategories: [
      {
        id: "mri-15t",
        label: "1.5T MRI systems",
        guidance: "Standard hospital imaging assets with stronger demand for complete deinstallation detail.",
        partRecords: [
          {
            id: "mri-ge-signa",
            manufacturer: "GE Healthcare",
            modelFamily: "SIGNA Explorer 1.5T",
            partNumber: "GE-SIG-1.5T",
            typicalForm: "Whole deinstalled MRI system",
            composition: [
              { label: "Cryogenic / superconducting subsystem", value: "System-specific" },
              { label: "Copper and electrical recovery", value: "8-14%" },
              { label: "Steel / shielding / mixed alloys", value: "55-72%" },
            ],
            pricingHint: "MRI pricing depends heavily on deinstallation stage, field status, and accessory completeness.",
          },
        ],
      },
      {
        id: "mri-3t",
        label: "3T MRI systems",
        guidance: "Higher-complexity medical systems where asset condition and documentation drive bid quality.",
        partRecords: [
          {
            id: "mri-siemens-skyra",
            manufacturer: "Siemens Healthineers",
            modelFamily: "MAGNETOM Skyra 3T",
            partNumber: "SKYRA-3T",
            typicalForm: "Full imaging unit with support subsystems",
            composition: [
              { label: "Cryogenic / superconducting subsystem", value: "System-specific" },
              { label: "Copper and electrical recovery", value: "9-15%" },
              { label: "Steel / shielding / mixed alloys", value: "58-74%" },
            ],
            pricingHint: "Recyclers move faster when service history and dismantling notes are attached.",
          },
        ],
      },
      {
        id: "mri-open",
        label: "Open MRI and extremity systems",
        guidance: "Smaller medical imaging systems where lot bundling and transport notes matter.",
        partRecords: [
          {
            id: "mri-fonar-open",
            manufacturer: "FONAR",
            modelFamily: "Upright Multi-Position MRI",
            partNumber: "UPR-MRI-600",
            typicalForm: "Open MRI assembly",
            composition: [
              { label: "Magnet / field subsystem", value: "System-specific" },
              { label: "Copper and electrical recovery", value: "7-11%" },
              { label: "Steel / mixed alloys", value: "52-69%" },
            ],
            pricingHint: "Transport readiness and removal photos are important for open MRI pricing.",
          },
        ],
      },
    ],
  },
  {
    familyId: "other-items",
    familyLabel: "Other Magnet Sources",
    lotExamples: ["Robotic arm actuators", "Lab motors", "Linear actuator packs"],
    subcategories: [
      {
        id: "robotic-arms",
        label: "Robotic arm actuators",
        guidance: "Industrial automation assemblies with embedded magnet and copper recovery value.",
        partRecords: [
          {
            id: "other-fanuc-actuator",
            manufacturer: "FANUC",
            modelFamily: "ARC Mate actuator motor",
            partNumber: "A06B-0247-B605",
            typicalForm: "Actuator motor or dismantled robot joint",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "0.9-1.4%" },
              { label: "Copper recovery", value: "9-13%" },
              { label: "Steel / aluminum", value: "68-77%" },
            ],
            pricingHint: "Robot actuator lots improve with OEM grouping and controller removal notes.",
          },
        ],
      },
      {
        id: "lab-equipment",
        label: "Lab equipment motors",
        guidance: "Smaller specialist equipment that benefits from detailed labeling and batching.",
        partRecords: [
          {
            id: "other-eppendorf-spin",
            manufacturer: "Eppendorf",
            modelFamily: "5804 centrifuge drive motor",
            partNumber: "5804-DRIVE",
            typicalForm: "Separated lab motor assemblies",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "0.6-0.9%" },
              { label: "Copper recovery", value: "8-11%" },
              { label: "Mixed steel / aluminum", value: "61-72%" },
            ],
            pricingHint: "Lab equipment buyers need clear counts and batch consistency to avoid over-diligence.",
          },
        ],
      },
      {
        id: "linear-actuators",
        label: "Linear actuator systems",
        guidance: "Useful for automation teardown programs and specialty industrial salvage.",
        partRecords: [
          {
            id: "other-thk-linear",
            manufacturer: "THK",
            modelFamily: "KR linear actuator",
            partNumber: "KR45-540A",
            typicalForm: "Linear actuator assembly",
            composition: [
              { label: "NdFeB / specialty magnet fraction", value: "0.7-1.0%" },
              { label: "Copper recovery", value: "7-10%" },
              { label: "Steel / aluminum", value: "69-78%" },
            ],
            pricingHint: "Actuator lots price better when rails, housings, and motors are separated consistently.",
          },
        ],
      },
    ],
  },
];
