import mongoose from "mongoose";

/*
====================================================
CVE MODEL
====================================================
*/

const cveSchema = new mongoose.Schema(
  {
    /*
    ====================================================
    BASIC CVE INFORMATION
    ====================================================
    */

    cveId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },

    sourceIdentifier: {
      type: String,
      trim: true,
    },

    vulnStatus: {
      type: String,
      index: true,
    },

    /*
    ====================================================
    IMPORTANT DATES
    ====================================================
    */

    published: {
      type: Date,
      index: true,
    },

    lastModified: {
      type: Date,
    },

    /*
    ====================================================
    DESCRIPTION
    ====================================================
    */

    description: {
      type: String,
      trim: true,
    },

    /*
    ====================================================
    CVSS / SECURITY METRICS
    ====================================================
    */

    severity: {
      type: String,
      index: true,
    },

    score: {
      type: Number,
      index: true,
    },

    attackVector: {
      type: String,
    },

    attackComplexity: {
      type: String,
    },

    exploitabilityScore: {
      type: Number,
    },

    impactScore: {
      type: Number,
    },

    /*
    ====================================================
    RAW RESPONSE
    ====================================================
    */

    raw: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

/*
====================================================
CVE INDEXES
====================================================
*/

// Query optimization
cveSchema.index({
  severity: 1,
  score: -1,
});

// Sorting optimization
cveSchema.index({
  published: -1,
});

// Full text search
cveSchema.index({
  cveId: "text",
  description: "text",
});

const CVE = mongoose.model("CVE", cveSchema);

/*
====================================================
PROGRESS MODEL
====================================================
*/

const progressSchema = new mongoose.Schema({
    task: { type: String, required: true, unique: true }, 
    lastIndex: { type: Number, required: true }, 
});

const Progress = mongoose.model('Progress', progressSchema);

/*
====================================================
EXPORTS
====================================================
*/

export { CVE, Progress };
export default { CVE, Progress };
