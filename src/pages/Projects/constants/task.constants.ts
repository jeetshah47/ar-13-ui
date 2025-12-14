export const DRAWING_LIST = [
    {
      "type": "Concept & Schematic Design Drawings",
      "items": [
        { "name": "Site Plan (Conceptual)", "description": "Shows building footprint, orientation, access, and basic layout on site.", "key": "site_plan_concept" },
        { "name": "Key Plan / Location Plan", "description": "Indicates project location in a larger context or city map.", "key": "key_plan" },
        { "name": "Floor Plans (Concept)", "description": "Rough layout showing space arrangement and functional flow.", "key": "floor_plan_concept" },
        { "name": "Massing Study / 3D View", "description": "Represents basic form, height, and volume of the structure.", "key": "massing_study" },
        { "name": "Elevations (Concept)", "description": "Initial exterior design ideas for facades and overall aesthetics.", "key": "elevation_concept" },
        { "name": "Sections (Concept)", "description": "Vertical cuts to understand volume, height, and spatial relation.", "key": "section_concept" },
        { "name": "Zoning / FAR Study", "description": "Ensures compliance with local building bylaws, setbacks, and height limits.", "key": "zoning_far_study" }
      ]
    },
    {
      "type": "Design Development Drawings",
      "items": [
        { "name": "Site Plan (Detailed)", "description": "Shows contours, access roads, landscape, and utilities.", "key": "site_plan_detailed" },
        { "name": "Floor Plans (Detailed)", "description": "Dimensioned and labeled plans with walls, openings, and levels.", "key": "floor_plan_detailed" },
        { "name": "Roof Plan", "description": "Shows slopes, drainage, parapets, and service equipment.", "key": "roof_plan" },
        { "name": "Elevations (Detailed)", "description": "Exterior façade details with heights and materials.", "key": "elevation_detailed" },
        { "name": "Sections (Detailed)", "description": "Detailed cross-sections with structural and architectural information.", "key": "section_detailed" },
        { "name": "Door & Window Schedule", "description": "List and details of all openings, frame sizes, and materials.", "key": "door_window_schedule" },
        { "name": "Furniture Layout Plan", "description": "Indicates placement of fixed and movable furniture.", "key": "furniture_layout" },
        { "name": "Reflected Ceiling Plan (RCP)", "description": "Shows ceiling patterns, lighting, and HVAC diffusers.", "key": "reflected_ceiling_plan" },
        { "name": "Material Palette / Finishing Schedule", "description": "Lists all surface materials and finishes with color codes.", "key": "material_palette" },
        { "name": "Staircase & Ramp Details", "description": "Detailed design of steps, risers, and railings.", "key": "stair_ramp_details" }
      ]
    },
    {
      "type": "Construction / Working Drawings",
      "items": [
        { "name": "General Arrangement (GA) Plans", "description": "Fully dimensioned floor plans for construction execution.", "key": "ga_plan" },
        { "name": "Detailed Sections & Elevations", "description": "Larger-scale drawings (1:20 or 1:10) showing design clarity.", "key": "detailed_sections" },
        { "name": "Wall Section Details", "description": "Explains full wall buildup from foundation to parapet.", "key": "wall_section" },
        { "name": "Toilet / Kitchen Details", "description": "Detailed layout with tiles, plumbing points, and fixtures.", "key": "toilet_kitchen_details" },
        { "name": "Door / Window Details", "description": "Shows frame, sill, and jamb design with joinery.", "key": "door_window_details" },
        { "name": "Joinery Details", "description": "Cabinets, wardrobes, and wooden partitions with dimensions.", "key": "joinery_details" },
        { "name": "Flooring Layout Plan", "description": "Tile/granite pattern with floor levels and expansion joints.", "key": "flooring_layout" },
        { "name": "Waterproofing Details", "description": "Details of waterproofing treatment for toilets, terraces, etc.", "key": "waterproofing_details" },
        { "name": "Roof Details", "description": "Shows waterproofing layers, drainage slopes, and outlets.", "key": "roof_details" },
        { "name": "False Ceiling & Lighting Details", "description": "Lighting fixtures and ceiling cutout designs.", "key": "false_ceiling_lighting" },
        { "name": "Signage & Graphics Plan", "description": "Placement of wayfinding or name boards.", "key": "signage_graphics" }
      ]
    },
    {
      "type": "Coordination Drawings",
      "items": [
        { "name": "Structural Drawings", "description": "Foundation, column, beam, slab, and reinforcement details.", "key": "structural_drawings" },
        { "name": "Electrical Layouts", "description": "Switches, sockets, panels, and light points layout.", "key": "electrical_layout" },
        { "name": "Plumbing & Drainage Layouts", "description": "Water supply, drainage, and vent lines.", "key": "plumbing_layout" },
        { "name": "HVAC Layouts", "description": "Air conditioning ducts, diffusers, and AHU positions.", "key": "hvac_layout" },
        { "name": "Fire Fighting Layouts", "description": "Hydrants, sprinklers, and fire alarm network.", "key": "fire_fighting_layout" },
        { "name": "Gas Supply Layout", "description": "If applicable, indicates gas pipelines and safety systems.", "key": "gas_supply_layout" }
      ]
    },
    {
      "type": "Landscape & Exterior Works",
      "items": [
        { "name": "Landscape Master Plan", "description": "Overall outdoor design showing planting and pathways.", "key": "landscape_master_plan" },
        { "name": "Hardscape & Softscape Layout", "description": "Details of pavements, lawns, and outdoor surfaces.", "key": "hard_soft_layout" },
        { "name": "Planting Plan & Schedule", "description": "Species, quantity, and arrangement of plants.", "key": "planting_plan" },
        { "name": "Site Grading & Drainage Plan", "description": "Indicates slope, drainage, and levels of outdoor areas.", "key": "grading_drainage" },
        { "name": "Boundary Wall & Gate Details", "description": "Design and materials for fencing and entrances.", "key": "boundary_gate_details" },
        { "name": "Paving & Outdoor Furniture Details", "description": "Details for paving materials, benches, and lighting.", "key": "paving_furniture_details" }
      ]
    },
    {
      "type": "Authority Submission Drawings",
      "items": [
        { "name": "Key Plan & Location Plan", "description": "Project location with nearby roads and landmarks.", "key": "authority_key_plan" },
        { "name": "Site Plan with Setbacks", "description": "Site boundaries, setbacks, and orientation.", "key": "authority_site_plan" },
        { "name": "Floor Plans, Roof Plan, and Sections", "description": "Complete building layout for sanctioning authority.", "key": "authority_plans" },
        { "name": "Elevations", "description": "Front and side elevations for approval.", "key": "authority_elevations" },
        { "name": "Parking Layout", "description": "Car and bike parking arrangement per norms.", "key": "authority_parking" },
        { "name": "Water & Drainage Layout", "description": "Plumbing network and sewage connection details.", "key": "authority_drainage" },
        { "name": "FAR / FSI & Area Statement", "description": "Total built-up, plot area, and permissible limits.", "key": "far_fsi_statement" },
        { "name": "Structural Stability & Fire Compliance", "description": "Certificates and drawings per authority norms.", "key": "authority_compliance" }
      ]
    },
    {
      "type": "Presentation Drawings",
      "items": [
        { "name": "3D Exterior Views / Renders", "description": "Photorealistic images showing exterior design.", "key": "render_exterior" },
        { "name": "Interior Renders", "description": "Visualization of key interior spaces.", "key": "render_interior" },
        { "name": "Walkthrough Animation", "description": "Video walkthrough for presentation and marketing.", "key": "render_walkthrough" },
        { "name": "Mood Boards & Material Boards", "description": "Showcases materials, textures, and colors.", "key": "mood_board" },
        { "name": "Presentation Sheets", "description": "Annotated boards summarizing project design.", "key": "presentation_sheets" }
      ]
    },
    {
      "type": "As-Built Drawings",
      "items": [
        { "name": "Final As-Built Plans", "description": "Reflects actual constructed layout and dimensions.", "key": "asbuilt_plans" },
        { "name": "As-Built Elevations & Sections", "description": "Updated based on on-site execution.", "key": "asbuilt_elevations" },
        { "name": "As-Built MEP Drawings", "description": "Final routing of all mechanical, electrical, plumbing systems.", "key": "asbuilt_mep" }
      ]
    }
  ]
  