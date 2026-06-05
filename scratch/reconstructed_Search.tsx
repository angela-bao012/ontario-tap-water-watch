import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Search, MapPin, CheckCircle2, ChevronRight, ChevronDown, Droplet, Loader2, XCircle, AlertTriangle, ArrowLeft, Microscope, FlaskConical, Heart, Filter, Bell, Check, ExternalLink, ShoppingCart, Eye, Gauge, X, Sparkles, LayoutGrid, BarChart3, Settings, Waves, Smile, Wrench, Shirt, Coffee, GlassWater } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

interface WaterTest {
  contaminant: string;
  level: number | null;
  maxLevel?: number | null;
  unit: string;
  legalLimit: number;
  healthGuideline: number;
  riskLevel: 'low' | 'moderate' | 'high';
  sampleCount: number;
  latestYear: number;
  exceedanceCount?: number;
  parameterLimit?: string | null;
}

interface LocationResult {
  dws_id: number;
  dws_name: string;
  display_name?: string | null;
  phu_name: string;
  dws_category: string;
  regulation: string;
  city_hint: string | null;
  totalTests?: number;
  exceedances?: number;
  passed?: number;
  label?: string;
  owner_name?: string;
  sample_types?: string[];
  dwsp_data?: {
    matched_system_name: string;
    hardness_avg: number | null;
    iron_avg: number | null;
    ph_avg: number | null;
  } | null;
  is_regional_estimate?: boolean;
  esti

### Automated Tests
- Run `npx tsc --noEmit` to ensure TypeScript compilation passes.

### Manual Verification
- Go to `http://localhost:3000/`.
- Click on "Newmarket" popular search.
- Verify that it immediately searches and loads the results list.
- Verify that the results show their status badges ("Safe" / "Attention Required").
- Click on one of the results.
- Verify that the details view loads successfully.
- Click on a parameter card (e.g. Lead or Fluoride) to expand it.
- Verify that it automatically loads and displays the past samples immediately without requiring an extra button click.

}

const AVAILABLE_YEARS = [2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016] as const;
// MISSING LINE 61
// MISSING LINE 62
// MISSING LINE 63
// MISSING LINE 64
// MISSING LINE 65
// MISSING LINE 66
// MISSING LINE 67
// MISSING LINE 68
// MISSING LINE 69
// MISSING LINE 70
// MISSING LINE 71
// MISSING LINE 72
// MISSING LINE 73
// MISSING LINE 74
// MISSING LINE 75
// MISSING LINE 76
// MISSING LINE 77
// MISSING LINE 78
// MISSING LINE 79
// MISSING LINE 80
// MISSING LINE 81
// MISSING LINE 82
// MISSING LINE 83
// MISSING LINE 84
// MISSING LINE 85
// MISSING LINE 86
// MISSING LINE 87
// MISSING LINE 88
// MISSING LINE 89
// MISSING LINE 90
// MISSING LINE 91
// MISSING LINE 92
// MISSING LINE 93
// MISSING LINE 94
// MISSING LINE 95
// MISSING LINE 96
// MISSING LINE 97
// MISSING LINE 98
// MISSING LINE 99
// MISSING LINE 100
// MISSING LINE 101
// MISSING LINE 102
// MISSING LINE 103
// MISSING LINE 104
// MISSING LINE 105
// MISSING LINE 106
// MISSING LINE 107
// MISSING LINE 108
// MISSING LINE 109
// MISSING LINE 110
// MISSING LINE 111
// MISSING LINE 112
// MISSING LINE 113
// MISSING LINE 114
// MISSING LINE 115
// MISSING LINE 116
// MISSING LINE 117
// MISSING LINE 118
// MISSING LINE 119
// MISSING LINE 120
// MISSING LINE 121
// MISSING LINE 122
// MISSING LINE 123
// MISSING LINE 124
// MISSING LINE 125
// MISSING LINE 126
// MISSING LINE 127
// MISSING LINE 128
// MISSING LINE 129
// MISSING LINE 130
// MISSING LINE 131
// MISSING LINE 132
// MISSING LINE 133
// MISSING LINE 134
// MISSING LINE 135
// MISSING LINE 136
// MISSING LINE 137
// MISSING LINE 138
// MISSING LINE 139
// MISSING LINE 140
// MISSING LINE 141
// MISSING LINE 142
// MISSING LINE 143
// MISSING LINE 144
// MISSING LINE 145
// MISSING LINE 146
// MISSING LINE 147
// MISSING LINE 148
// MISSING LINE 149
// MISSING LINE 150
// MISSING LINE 151
// MISSING LINE 152
// MISSING LINE 153
// MISSING LINE 154
// MISSING LINE 155
// MISSING LINE 156
// MISSING LINE 157
// MISSING LINE 158
// MISSING LINE 159
// MISSING LINE 160
// MISSING LINE 161
// MISSING LINE 162
// MISSING LINE 163
// MISSING LINE 164
// MISSING LINE 165
// MISSING LINE 166
// MISSING LINE 167
// MISSING LINE 168
// MISSING LINE 169
// MISSING LINE 170
// MISSING LINE 171
// MISSING LINE 172
// MISSING LINE 173
// MISSING LINE 174
// MISSING LINE 175
// MISSING LINE 176
// MISSING LINE 177
// MISSING LINE 178
// MISSING LINE 179
// MISSING LINE 180
// MISSING LINE 181
// MISSING LINE 182
// MISSING LINE 183
// MISSING LINE 184
// MISSING LINE 185
// MISSING LINE 186
// MISSING LINE 187
// MISSING LINE 188
// MISSING LINE 189
// MISSING LINE 190
// MISSING LINE 191
// MISSING LINE 192
// MISSING LINE 193
// MISSING LINE 194
// MISSING LINE 195
// MISSING LINE 196
// MISSING LINE 197
// MISSING LINE 198
// MISSING LINE 199
// MISSING LINE 200
// MISSING LINE 201
// MISSING LINE 202
// MISSING LINE 203
// MISSING LINE 204
// MISSING LINE 205
// MISSING LINE 206
// MISSING LINE 207
// MISSING LINE 208
// MISSING LINE 209
// MISSING LINE 210
// MISSING LINE 211
// MISSING LINE 212
// MISSING LINE 213
// MISSING LINE 214
// MISSING LINE 215
// MISSING LINE 216
// MISSING LINE 217
// MISSING LINE 218
// MISSING LINE 219
// MISSING LINE 220
// MISSING LINE 221
// MISSING LINE 222
// MISSING LINE 223
// MISSING LINE 224
// MISSING LINE 225
// MISSING LINE 226
// MISSING LINE 227
// MISSING LINE 228
// MISSING LINE 229
// MISSING LINE 230
// MISSING LINE 231
// MISSING LINE 232
// MISSING LINE 233
// MISSING LINE 234
// MISSING LINE 235
// MISSING LINE 236
// MISSING LINE 237
// MISSING LINE 238
// MISSING LINE 239
// MISSING LINE 240
// MISSING LINE 241
// MISSING LINE 242
// MISSING LINE 243
// MISSING LINE 244
// MISSING LINE 245
// MISSING LINE 246
// MISSING LINE 247
// MISSING LINE 248
// MISSING LINE 249
// MISSING LINE 250
// MISSING LINE 251
// MISSING LINE 252
// MISSING LINE 253
// MISSING LINE 254
// MISSING LINE 255
// MISSING LINE 256
// MISSING LINE 257
// MISSING LINE 258
// MISSING LINE 259
// MISSING LINE 260
// MISSING LINE 261
// MISSING LINE 262
// MISSING LINE 263
// MISSING LINE 264
// MISSING LINE 265
// MISSING LINE 266
// MISSING LINE 267
// MISSING LINE 268
// MISSING LINE 269
// MISSING LINE 270
// MISSING LINE 271
// MISSING LINE 272
// MISSING LINE 273
// MISSING LINE 274
// MISSING LINE 275
// MISSING LINE 276
// MISSING LINE 277
// MISSING LINE 278
// MISSING LINE 279
// MISSING LINE 280
// MISSING LINE 281
// MISSING LINE 282
// MISSING LINE 283
// MISSING LINE 284
// MISSING LINE 285
// MISSING LINE 286
// MISSING LINE 287
// MISSING LINE 288
// MISSING LINE 289
// MISSING LINE 290
// MISSING LINE 291
// MISSING LINE 292
// MISSING LINE 293
// MISSING LINE 294
// MISSING LINE 295
// MISSING LINE 296
// MISSING LINE 297
// MISSING LINE 298
// MISSING LINE 299
// MISSING LINE 300
// MISSING LINE 301
// MISSING LINE 302
// MISSING LINE 303
// MISSING LINE 304
// MISSING LINE 305
// MISSING LINE 306
// MISSING LINE 307
// MISSING LINE 308
// MISSING LINE 309
// MISSING LINE 310
// MISSING LINE 311
// MISSING LINE 312
// MISSING LINE 313
// MISSING LINE 314
// MISSING LINE 315
// MISSING LINE 316
// MISSING LINE 317
// MISSING LINE 318
// MISSING LINE 319
// MISSING LINE 320
// MISSING LINE 321
// MISSING LINE 322
// MISSING LINE 323
// MISSING LINE 324
// MISSING LINE 325
// MISSING LINE 326
// MISSING LINE 327
// MISSING LINE 328
// MISSING LINE 329
// MISSING LINE 330
// MISSING LINE 331
// MISSING LINE 332
// MISSING LINE 333
// MISSING LINE 334
// MISSING LINE 335
// MISSING LINE 336
// MISSING LINE 337
// MISSING LINE 338
// MISSING LINE 339
// MISSING LINE 340
// MISSING LINE 341
// MISSING LINE 342
// MISSING LINE 343
// MISSING LINE 344
// MISSING LINE 345
// MISSING LINE 346
// MISSING LINE 347
// MISSING LINE 348
// MISSING LINE 349
// MISSING LINE 350
// MISSING LINE 351
// MISSING LINE 352
// MISSING LINE 353
// MISSING LINE 354
// MISSING LINE 355
// MISSING LINE 356
// MISSING LINE 357
// MISSING LINE 358
// MISSING LINE 359
// MISSING LINE 360
// MISSING LINE 361
// MISSING LINE 362
// MISSING LINE 363
// MISSING LINE 364
// MISSING LINE 365
// MISSING LINE 366
// MISSING LINE 367
// MISSING LINE 368
// MISSING LINE 369
// MISSING LINE 370
// MISSING LINE 371
// MISSING LINE 372
// MISSING LINE 373
// MISSING LINE 374
// MISSING LINE 375
// MISSING LINE 376
// MISSING LINE 377
// MISSING LINE 378
// MISSING LINE 379
// MISSING LINE 380
// MISSING LINE 381
// MISSING LINE 382
// MISSING LINE 383
// MISSING LINE 384
// MISSING LINE 385
// MISSING LINE 386
// MISSING LINE 387
// MISSING LINE 388
// MISSING LINE 389
// MISSING LINE 390
// MISSING LINE 391
// MISSING LINE 392
// MISSING LINE 393
// MISSING LINE 394
// MISSING LINE 395
// MISSING LINE 396
// MISSING LINE 397
// MISSING LINE 398
// MISSING LINE 399
  const isMicrobeUnit = (u: string) => u.includes("CFU") || u.includes("MPN") || u.includes("C/100ML") || u.includes("P/A");
  if (isMicrobeUnit(sUnit) && isMicrobeUnit(limitUnit)) {
    return `${val} ${sUnit}`;
  }
  
  return limitText;
};

const getOntarioLimitInfo = (
  contaminant: string,
  level: number | null,
  unit: string,
  exceedanceCount: number,
  dbLimit?: string | null
): { limitText: string; isExceeded: boolean } | null => {
  const norm = contaminant.toLowerCase().trim();
  const hasExceedance = exceedanceCount > 0;

  // 1. Try to find the limit string from dbLimit first, then EXCEL_LIMITS, then microbe fallbacks
  let limitText = dbLimit;
  if (!limitText || limitText === "N/A" || limitText.trim() === "") {
    limitText = "N/A";
    for (const [k, v] of Object.entries(EXCEL_LIMITS)) {
      if (norm.includes(k) || k.includes(norm)) {
        limitText = v;
        break;
      }
    }
  }

  if (limitText === "N/A") {
    if (norm.includes("escherichia") || norm === "e. coli" || (norm.includes("coli") && !norm.includes("coliform"))) {
      limitText = "0 CFU/100ML";
    } else if (norm.includes("coliform")) {
      limitText = "0 CFU/100ML";
    }
  }

  if (limitText === "N/A" || limitText === " " || limitText.trim() === "") {
    return null;
  }

  // Standardize unit to match sample unit
  const standardizedLimitText = standardizeLimitText(limitText, unit);

  // 2. Determine if the level exceeds the limit
  let isExceeded = hasExceedance;

  if (level !== null) {
    const match = standardizedLimitText.trim().match(/^([0-9.]+)\s*(.*)$/);
    if (match) {
      const limitVal = parseFloat(match[1]);
      const limitUnit = match[2].trim().toUpperCase();
      const levelUnit = unit.trim().toUpperCase();

      if (levelUnit === limitUnit) {
        isExceeded = isExceeded || level > limitVal;
      } else if (levelUnit === "UG/L" && limitUnit === "MG/L") {
        isExceeded = isExceeded || level > (limitVal * 1000);
      } else if (levelUnit === "MG/L" && limitUnit === "UG/L") {
        isExceeded = isExceeded || (level * 1000) > limitVal;
// MISSING LINE 461
// MISSING LINE 462
// MISSING LINE 463
// MISSING LINE 464
// MISSING LINE 465
// MISSING LINE 466
// MISSING LINE 467
// MISSING LINE 468
// MISSING LINE 469
// MISSING LINE 470
// MISSING LINE 471
// MISSING LINE 472
// MISSING LINE 473
// MISSING LINE 474
// MISSING LINE 475
// MISSING LINE 476
// MISSING LINE 477
// MISSING LINE 478
// MISSING LINE 479
// MISSING LINE 480
// MISSING LINE 481
// MISSING LINE 482
// MISSING LINE 483
// MISSING LINE 484
// MISSING LINE 485
// MISSING LINE 486
// MISSING LINE 487
// MISSING LINE 488
// MISSING LINE 489
// MISSING LINE 490
// MISSING LINE 491
// MISSING LINE 492
// MISSING LINE 493
// MISSING LINE 494
// MISSING LINE 495
// MISSING LINE 496
// MISSING LINE 497
// MISSING LINE 498
// MISSING LINE 499
// MISSING LINE 500
// MISSING LINE 501
// MISSING LINE 502
// MISSING LINE 503
// MISSING LINE 504
// MISSING LINE 505
// MISSING LINE 506
// MISSING LINE 507
// MISSING LINE 508
// MISSING LINE 509
// MISSING LINE 510
// MISSING LINE 511
// MISSING LINE 512
// MISSING LINE 513
// MISSING LINE 514
// MISSING LINE 515
// MISSING LINE 516
// MISSING LINE 517
// MISSING LINE 518
// MISSING LINE 519
// MISSING LINE 520
// MISSING LINE 521
// MISSING LINE 522
// MISSING LINE 523
// MISSING LINE 524
// MISSING LINE 525
// MISSING LINE 526
// MISSING LINE 527
// MISSING LINE 528
// MISSING LINE 529
// MISSING LINE 530
// MISSING LINE 531
// MISSING LINE 532
// MISSING LINE 533
// MISSING LINE 534
// MISSING LINE 535
// MISSING LINE 536
// MISSING LINE 537
// MISSING LINE 538
// MISSING LINE 539
// MISSING LINE 540
// MISSING LINE 541
// MISSING LINE 542
// MISSING LINE 543
// MISSING LINE 544
// MISSING LINE 545
// MISSING LINE 546
// MISSING LINE 547
// MISSING LINE 548
// MISSING LINE 549
// MISSING LINE 550
// MISSING LINE 551
// MISSING LINE 552
// MISSING LINE 553
// MISSING LINE 554
// MISSING LINE 555
// MISSING LINE 556
// MISSING LINE 557
// MISSING LINE 558
// MISSING LINE 559
// MISSING LINE 560
// MISSING LINE 561
// MISSING LINE 562
// MISSING LINE 563
// MISSING LINE 564
// MISSING LINE 565
// MISSING LINE 566
// MISSING LINE 567
// MISSING LINE 568
// MISSING LINE 569
// MISSING LINE 570
// MISSING LINE 571
// MISSING LINE 572
// MISSING LINE 573
// MISSING LINE 574
// MISSING LINE 575
// MISSING LINE 576
// MISSING LINE 577
// MISSING LINE 578
// MISSING LINE 579

const getHardnessInfo = (tests: WaterTest[], dwspData?: any) => {
  let hardness = 0;
  let hasAvg = false;

  if (dwspData && dwspData.hardness_avg !== undefined && dwspData.hardness_avg !== null) {
    hardness = dwspData.hardness_avg;
    hasAvg = true;
  } else {
    let calcium = 0;
    let magnesium = 0;
    let iron = 0;
    let manganese = 0;
    let directHardness = 0;
    let hasMineralData = false;

    tests.forEach(t => {
      const name = t.contaminant.toLowerCase().trim();
      const level = t.level || 0;
      if (level === 0) return;

      const isUg = (t.unit || "").toLowerCase().includes("ug");
      const valMg = isUg ? level / 1000 : level;

      if (name.includes("calcium")) {
        calcium = valMg;
        hasMineralData = true;
      } else if (name.includes("magnesium")) {
        magnesium = valMg;
        hasMineralData = true;
      } else if (name.includes("manganese")) {
        manganese = valMg;
        hasMineralData = true;
      } else if (name.includes("iron")) {
        iron = valMg;
        hasMineralData = true;
      } else if (name.includes("hardness")) {
        directHardness = valMg;
      }
    });

    hardness = 2.497 * calcium + 4.118 * magnesium + 1.792 * iron + 1.822 * manganese;
    if (hardness === 0 && directHardness > 0) {
      hardness = directHardness;
      hasMineralData = true;
    }
    hasAvg = hasMineralData && hardness > 0;
  }

  let pct = 10;
  let statusText = "Soft Water";
  let textColor = "text-emerald-500";
  let userTip = "Soft water. Excellent for soap lathering and leaves zero risk of mineral scale buildup in pipes or fixtures.";
  let feelsLike = "Soap lathers easily and rinses away cleanly. Faucets and glass doors will remain free of mineral scale buildup.";
  let practicalAdvice = "No water softeners or specialized scale filters are required.";

  if (!hasAvg && hardness === 0) {
    pct = 10;
    statusText = "NO DATA";
    textColor = "text-gray-400";
    userTip = "No hardness mineral measurements available.";
    feelsLike = "No details available.";
    practicalAdvice = "";
  } else {
    // Dynamic slider indicator mapping along the 0 to 250+ mg/L spectrum
    const clamped = Math.min(250, Math.max(0, hardness));
    pct = 10 + (clamped / 250) * 80;

    if (hardness <= 60) {
      statusText = "Soft Water";
      textColor = "text-emerald-500";
// MISSING LINE 651
// MISSING LINE 652
// MISSING LINE 653
// MISSING LINE 654
// MISSING LINE 655
// MISSING LINE 656
// MISSING LINE 657
// MISSING LINE 658
// MISSING LINE 659
// MISSING LINE 660
// MISSING LINE 661
// MISSING LINE 662
// MISSING LINE 663
// MISSING LINE 664
// MISSING LINE 665
// MISSING LINE 666
// MISSING LINE 667
// MISSING LINE 668
// MISSING LINE 669
      feelsLike = "Soap lathers poorly and leaves a heavy film. Heavy mineral scale can build up rapidly in pipes and shorten appliance lifespans.";
      practicalAdvice = "A whole-home water softener is highly recommended to protect plumbing and improve lather.";
    }
  }
  return { hardness, pct, statusText, textColor, userTip, feelsLike, practicalAdvice };
}

export function SearchPage() {
  const navigate = useNavigate();
  const { query: routeQuery, dwsId: routeDwsId } = useParams();
  const [searchParams] = useSearchParams();
  const queryVal = routeQuery || searchParams.get("q") || "";
  const [searchTerm, setSearchTerm] = useState(queryVal);
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [waterTests, setWaterTests] = useState<WaterTest[]>([]);
  const [exceedances, setExceedances] = useState<Exceedance[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [detailTab, setDetailTab] = useState<'quality' | 'filters'>('quality');
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [rawSamplesData, setRawSamplesData] = useState<Record<string, any[]>>({});
  const [rawSamplesLoading, setRawSamplesLoading] = useState<Record<string, boolean>>({});
  const [showAllParameters, setShowAllParameters] = useState(false);
  const [showAllContaminants, setShowAllContaminants] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAestheticModal, setShowAestheticModal] = useState(false);
  const [showMetalsModal, setShowMetalsModal] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);

  const hardnessInfo = selectedLocation 
    ? getHardnessInfo(waterTests, selectedLocation.dwsp_data) 
    : { hardness: 0, pct: 10, statusText: "NO DATA", textColor: "text-gray-400", userTip: "No hardness mineral measurements available.", feelsLike: "", practicalAdvice: "" };

  const getParameterCategory = (name: string): 'microbe' | 'chemical' | 'additive' | 'aesthetic' => {
    const lower = name.toLowerCase();
    if (
      lower.includes('coliform') || 
      lower.includes('e. coli') || 
      lower.includes('e.coli') || 
      low
      lower.includes('hpc') ||
      lower.includes('background')
    ) {
      return 'microbe';
      lower.includes('background')
    ) {
      return 'microbe';
    }
    if (
      lower.includes('fluoride') ||
      lower.includes('trihalomethane') ||
      lower.includes('haloacetic') ||
      lower.includes('chlorate') ||
      lower.includes('chlorite') ||
      lower.includes('chlorine')
    ) {
      return 'additive';
    }
    if (
      lower.includes('hardness') ||
      lower.includes('sodium') ||
      lower.includes('ph') ||
      lower.includes('turbidity') ||
      lower.includes('color') ||
      lower.includes('odour') ||
      lower.includes('taste') ||
      lower.includes('iron') ||
      lower.includes('manganese') ||
      lower.includes('zinc') ||
      lower.includes('copper') ||
      lower.includes('dissolved solids') ||
      lower.includes('alkalinity') ||
      lower.includes('temperature')
    ) {
      return 'aesthetic';
    }
    return 'chemical';
  };

  const getParameterIcon = (category: 'microbe' | 'chemical' | 'additive' | 'aesthetic') => {
    switch (category) {
      case 'microbe':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0">
            <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-green-600/10" />
          </div>
        );
      case 'additive':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-cyan-600/10" />
          </div>
        );
      case 'aesthetic':
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Droplet className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-blue-500/10" />
          </div>
        );
      case 'chemical':
      default:
        return (
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        );
    }
  };

  const microbes = waterTests.filter(t => getParameterCategory(t.contaminant) === 'microbe');
  const chemicals = waterTests.filter(t => getParameterCategory(t.contaminant) === 'chemical');
  const additives = waterTests.filter(t => getParameterCategory(t.contaminant) === 'additive');

  const isLowRiskParameter = (name: string): boolean => {
    const norm = name.toLowerCase().trim();
    return (
      norm.includes('coliform') ||
      norm.includes('sodium') ||
      norm.includes('hardness') ||
      norm.includes('manganese') ||
      norm.includes('iron') ||
      norm.includes('aluminum') ||
      norm.includes('ph') ||
      norm.includes('organic nitrogen') ||
      norm.includes('turbidity') ||
      norm.includes('taste') ||
      norm.includes('odour')
    );
  };

  const getSafetyBarConfig = (
    tests: WaterTest[],
    category: 'microbe' | 'chemical'
  ) => {
    const exceededContaminants = new Set<string>();

    tests.forEach(test => {
      if (getParameterCategory(test.contaminant) === category) {
        const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
        const isExceeded = limitInfo ? limitInfo.isExceeded : (test.exceedanceCount && test.exceedanceCount > 0);
        if (isExceeded) {
          exceededContaminants.add(test.contaminant);
        }
      }
    });

    exceedances.forEach(e => {
      if (getParameterCategory(e.parameter_name) === category) {
        exceededContaminants.add(e.parameter_name);
      }
    });

    const count = exceededContaminants.size;
    const list = Array.from(exceededContaminants);

    if (count === 0) {
      return {
        width: "5%",
        color: "bg-green-500",
        statusText: category === 'microbe' ? "CLEAN" : "LOW LEVELS",
        textColor: "text-green-600",
      };
    } else if (count === 1 && isLowRiskParameter(list[0])) {
      return {
        width: "20%",
        color: "bg-amber-500",
        statusText:
          const u2 = formatUnitForDisplay(unit || "").toLowerCase().trim();
          const unitMatch = u1 === u2;
          const nameMatch = (item.parameter_name || "").toLowerCase().trim() === contaminant.toLowerCase().trim();
          return unitMatch && nameMatch;
        });
        color: "bg-red-500",
        statusText: category === 'microbe' ? "TOO MUCH" : "TOO HIGH",
        textColor: "text-red-600",
      };
    }
  };

  const getAdditiveStatus = (additivesList: WaterTest[]) => {
    const exceededContaminants = new Set<string>();

    additivesList.forEach(test => {
      const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
      const isExceeded = limitInfo ? limitInfo.isExceeded : (test.exceedanceCount && test.exceedanceCount > 0);
      if (isExceeded) {
        exceededContaminants.add(test.contaminant);
      }
    });

    exceedances.forEach(e => {
      if (getParameterCategory(e.parameter_name) === 'additive') {
        exceededContaminants.add(e.parameter_name);
      }
    });

    const count = exceededContaminants.size;

    if (count > 0) {
      return {
        width: "100%",
        color: "bg-red-500",
        statusText: "EXCESSIVE",
        textColor: "text-red-600",
      };
    }

    const fluoride = additivesList.find(t => t.contaminant.toLowerCase().includes('fluoride'));
    if (fluoride && fluoride.level !== null && fluoride.level >= 0.5 && fluoride.level <= 0.8) {
      return {
        width: "50%",
        color: "bg-green-500",
        statusText: "OPTIMAL",
        textColor: "text-green-600",
      };
    }

    return {
      width: "5%",
      color: "bg-green-500",
      statusText: "SAFE",
      textColor: "text-green-600",
    };
  };

  const getAdditivesDescription = (additivesList: WaterTest[]) => {
    if (additivesList.length === 0) {
      return "No additive or treatment data available.";
    }

    const fluorideTest = additivesList.find(t => t.contaminant.toLowerCase().includes('fluoride'));
    const thmTest = additivesList.find(t => t.contaminant.toLowerCase().includes('trihalomethane'));
    const haaTest = additivesList.find(t => t.contaminant.toLowerCase().includes('haloacetic'));

    const parts: string[] = [];
    if (fluorideTest && fluorideTest.level !== null) {
      parts.push(`Fluoride: ${fluorideTest.level.toFixed(2)} mg/L`);
    }

    let chlorineByproducts = 0;
    let hasByproducts = false;
    if (thmTest && thmTest.level !== null) {
      chlorineByproducts += thmTest.level;
      hasByproducts = true;
    }
    if (haaTest && haaTest.level !== null) {
      chlorineByproducts += haaTest.level;
      hasByproducts = true;
    }

    if (hasByproducts) {
      parts.push(`Chlorine Byproducts: ${chlorineByproducts.toFixed(1)} µg/L`);
    }

    if (parts.length === 0) {
      return "No active treatment additives detected in tested parameters.";
    }

    const statusInfo = getAdditiveStatus(additivesList);
    if (statusInfo.statusText === "OPTIMAL") {
      return parts.join(" | ") + ". Optimal mineral fluoridation level for dental health.";
    }

    return parts.join(" | ") + ". Additives and byproducts are within safe limits.";
  };

  const microbeConfig = getSafetyBarConfig(waterTests, 'microbe');
  const chemicalConfig = getSafetyBarConfig(waterTests, 'chemical');
  const additiveConfig = getAdditiveStatus(additives);

  const getLatestSampleDate = () => {
    if (exceedances && exceedances.length > 0) {
      const dates = exceedances.map(e => new Date(e.sample_date)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        return maxDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
            
            if (routeDwsId) {
              const dwsIdNum = parseInt(routeDwsId, 10);
              if (!isNaN(dwsIdNum)) {
                const matched = (data || []).find((item: any) => item.dws_id === dwsIdNum);
                const locName = matched ? matched.dws_name : null;
                if (locName) {
                  await fetchWaterData(locName, selectedYear);
                } else {
                  setDataLoading(true);
                  const testRes = await fetch(`/api/locations/${dwsIdNum}/tests?year=${selectedYear}`);
                  if (testRes.ok) {
                    const testData = await testRes.json();
                    setWaterTests(testData.tests || []);
                    setExceedances(testData.exceedances || []);
                    setSelectedLocation(testData.location);
                  }
                  setDataLoading(false);
                }
              }
            } else {
              setSelectedLocation(null);
            }
          }
    
    const nameA = a.contaminant;
    const nameB = b.contaminant;
    const isLetterA = /^[a-zA-Z]/.test(nameA.trim());
    const isLetterB = /^[a-zA-Z]/.test(nameB.trim());
    
    if (isLetterA !== isLetterB) {
      return isLetterA ? 1 : -1; // letter starting ones come LAST
    }
    
    
    return nameA.localeCompare(nameB);
  });

  const toggleRowExpansion = (contaminant: string, unit: string) => {
    const key = `${contaminant}_${unit}`;
    const nextState = !expandedRows[key];
    setExpandedRows(prev => ({ ...prev, [key]: nextState }));
    if (nextState) {
      loadPastSamples(contaminant, unit);
    }
  };

  const loadPastSamples = async (contaminant: string, unit: string) => {
    const key = `${contaminant}_${unit}`;
    if (rawSamplesData[key] || rawSamplesLoading[key]) return;
    
    setRawSamplesLoading(prev => ({ ...prev, [key]: true }));
    try {
      const res = await fetch(`/api/water-data?location=${encodeURIComponent(selectedLocation!.dws_name)}&year=${selectedYear}&microbe=${encodeURIComponent(contaminant)}&limit=1000`);
      if (res.ok) {
        const data = await res.json();
        const filteredData = (data || []).filter((item: any) => {
          const u1 = formatUnitForDisplay(item.result_unit || "").toLowerCase().trim();
          const u2 = formatUnitForDisplay(unit || "").toLowerCase().trim();
          const unitMatch = u1 === u2;
          const nameMatch = (item.parameter_name || "").toLowerCase().trim() === contaminant.toLowerCase().trim();
          return unitMatch && nameMatch;
        });
        setRawSamplesData(prev => ({ ...prev, [key]: filteredData }));
      }
    } catch (err) {
      console.error("Error fetching raw samples:", err);
    } finally {
      setRawSamplesLoading(prev => ({ ...prev, [key]: false }));
    }
  };

  const renderSampleHistory = (rowKey: string, test: WaterTest) => {
    if (rawSamplesData[rowKey] === undefined) {
      loadPastSamples(test.contaminant, test.unit);
    }

    if (rawSamplesLoading[rowKey] || rawSamplesData[rowKey] === undefined) {
      return (
        <div className="flex items-center justify-center gap-1 py-2.5 text-gray-400 text-[8px] sm:text-[10px] bg-white rounded-md sm:rounded-lg border border-gray-100">
          <Loader2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin text-blue-500" />
          Loading sample records...
        </div>
      );
    }
    
    if (rawSamplesData[rowKey].length > 0) {
      return (
        <div className="space-y-1 sm:space-y-1.5 max-h-36 sm:max-h-48 overflow-y-auto pr-1">
          {rawSamplesData[rowKey].map((sample: any, sIdx: number) => {
    
    if (rawSamplesData[rowKey].length > 0) {
      return (
        <div className="space-y-1 sm:space-y-1.5 max-h-36 sm:max-h-48 overflow-y-auto pr-1">
          {rawSamplesData[rowKey].map((sample: any, sIdx: number) => {
            const sampleLimitInfo = getOntarioLimitInfo(sample.parameter_name, sample.result_value, sample.result_unit, sample.exceedance === 'Y' ? 1 : 0, sample.parameter_limit);
            const sampleExceeded = sampleLimitInfo ? sampleLimitInfo.isExceeded : sample.exceedance === 'Y';
            return (
              <div key={sIdx} className="flex justify-between items-center bg-white px-1.5 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-lg border border-gray-100 shadow-sm">
                <span className="font-semibold text-gray-600 text-[8px] sm:text-[10px]">{sample.sample_date}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-gray-900 text-[9px] sm:text-xs">
                    {sample.result_value !== null ? `${sample.result_value} ${formatUnitForDisplay(sample.result_unit)}` : (sample.exceedance === 'Y' ? 'Present' : '0')}
                  </span>
                  <span className={cn(
                    "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full shrink-0",
                    sampleExceeded ? "bg-red-500 animate-pulse" : "bg-green-500"
                  )} />
                </div>
              </div>
            );
          })}
        </div>
      );
    }
    
    return (
      <div className="text-center text-[8px] sm:text-[10px] text-gray-400 py-2.5 bg-white rounded-md sm:rounded-lg border border-gray-100">
        No sample history available.
      </div>
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || searchTerm.length < 2) return;
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  const fetchWaterData = async (locationName: string, year: number) => {
    setDataLoading(true);
    setExpandedRows({});
    setRawSamplesData({});
    setRawSamplesLoading({});
    setShowAllParameters(false);
    setShowAllContaminants(false);
    try {
      const url = `/api/water-data?location=${encodeURIComponent(locationName)}&year=${year}&aggregate=true`;
      const res = await fetch(url);
      const data: WaterDataResponse = await res.json();
      setWaterTests(data.tests || []);
      setExceedances(data.exceedances || []);
      setSelectedLocation(data.location);
    } catch (error) {
    }
  };

  useEffect(() => {
    const syncUrlState = async () => {
      if (queryVal) {
        setSearchTerm(queryVal);
      }
      if (queryVal && queryVal.length >= 2) {
        setHasSearched(true);
        setLoading(true);
        try {
          const res = await fetch(`/api/water-data?distinct_locations=true&q=${encodeURIComponent(queryVal)}&year=${selectedYear}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data || []);
            
            if (routeDwsId) {
              const dwsIdNum = parseInt(routeDwsId, 10);
              if (!isNaN(dwsIdNum)) {
                const matched = (data || []).find((item: any) => item.dws_id === dwsIdNum);
                const locName = matched ? matched.dws_name : null;
                if (locName) {
                  await fetchWaterData(locName, selectedYear);
                } else {
                  setDataLoading(true);
                  const testRes = await fetch(`/api/locations/${dwsIdNum}/tests?year=${selectedYear}`);
                  if (testRes.ok) {
                    const testData = await testRes.json();
                    setWaterTests(testData.tests || []);
                    setExceedances(testData.exceedances || []);
                    setSelectedLocation(testData.location);
                  }
                  setDataLoading(false);
                }
              }
            } else {
              setSelectedLocation(null);
            }
          }
        } catch (error) {
          console.error("URL sync error:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setHasSearched(false);
        setSelectedLocation(null);
      }
    };

    syncUrlState();
  }, [queryVal, routeDwsId, selectedYear]);

  // Show results list or detail view — never both
  const showResultsList = hasSearched && !selectedLocation;
  const showDetailView = selectedLocation;

  // ---- Smart filter recommendation logic (uses exceedances + test levels) ----
  type FilterRec = {
  const showResultsList = hasSearched && !selectedLocation;
  const showDetailView = selectedLocation;

  // ---- Smart filter recommendation logic (uses exceedances + test levels) ----
  type FilterRec = {
    primary: string;
    tagline: string;
    why: string;
    warning: string | null;
    badgeColor: string;
// MISSING LINE 1171
// MISSING LINE 1172
// MISSING LINE 1173
// MISSING LINE 1174
// MISSING LINE 1175
// MISSING LINE 1176
// MISSING LINE 1177
// MISSING LINE 1178
// MISSING LINE 1179

  return (
    <div className="pt-6 sm:pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3">Find Your Water Quality Report</h2>
        <p className="text-sm sm:text-base text-gray-600">Enter a city or water system name to see testing results.</p>
        
        <form onSubmit={handleSearch} className="mt-6 sm:mt-8">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Toronto, London..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base sm:text-lg pl-12 sm:pl-14"
            />
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <button 
              type="submit"
              disabled={loading || searchTerm.length < 2}
              className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-blue-600 text-white px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Search
            </button>
          </div>

      if (thmKeywords.some(k => n.includes(k))) thmScore += 3;
      if (hardnessKeywords.some(k => n.includes(k))) hardnessScore += 4;
      if (tasteKeywords.some(k => n.includes(k))) tasteScore += 2;
    });

    // Check high-level tests
    highLevel.forEach(t => {
      const n = (t.contaminant || "").toLowerCase();
      if (heavyMetalKeywords.some(k => n.includes(k))) heavyMetalScore += 3;
      if (nitrateKeywords.some(k => n.includes(k))) nitrateScore += 3;
      if (thmKeywords.some(k => n.includes(k))) thmScore += 2;
      if (hardnessKeywords.some(k => n.includes(k))) hardnessScore += 3;
      if (tasteKeywords.some(k => n.includes(k))) tasteScore += 1;
    });

    // Build recommendations based on highest scores
    if (heavyMetalScore >= 3 || nitrateScore >= 3) {
      recs["Reverse Osmosis"] = {
        score: heavyMetalScore + nitrateScore,
        tag: "Heavy metals / nitrates detected",
        warning: "Standard pitcher filters will NOT remove these contaminants. An under-sink RO or specialized heavy-metal filter is required.",
      };
    }

    if (thmScore >= 2 || tasteScore >= 2) {
      recs["Activated Carbon"] = {
        score: thmScore + tasteScore,
        tag: "THMs / taste concerns",
        warning: null,
      };
    }

      };
    }

    // Return primary rec + any secondary recs, sorted by score
    const sorted = Object.entries(recs)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.score - a.score);

    if (sorted.length === 0 && exceedances.length > 0) {
      return [{
        name: "Combined Systems",
        score: 1,
        tag: "General contaminant concerns",
        warning: null,
      }];
    }

    if (sorted.length === 0 && waterTests.length > 0) {
      // No specific flags — suggest basic carbon
      return [{
        name: "Activated Carbon",
        score: 1,
        tag: "General water quality",
        warning: null,
      }];
    }

    return sorted;
  };

  const filterRecDisplay = (rec: any): FilterRec => {
    switch (rec.name) {
      case "Reverse Osmosis":
        return {
          primary: "Reverse Osmosis (RO) System",
          tagline: rec.tag,
          why: "Your water shows elevated heavy metals or nitrates — RO is the most effective residential option, removing up to 99% of dissolved contaminants including lead, arsenic, and nitrates.",
          warning: rec.warning,
          badgeColor: "bg-purple-600",
          badgeBg: "bg-purple-50 text-purple-700",
          badgeText: "Recommended",
// MISSING LINE 1281
// MISSING LINE 1282
// MISSING LINE 1283
// MISSING LINE 1284
// MISSING LINE 1285
// MISSING LINE 1286
// MISSING LINE 1287
// MISSING LINE 1288
// MISSING LINE 1289
// MISSING LINE 1290
// MISSING LINE 1291
// MISSING LINE 1292
// MISSING LINE 1293
// MISSING LINE 1294
// MISSING LINE 1295
// MISSING LINE 1296
// MISSING LINE 1297
// MISSING LINE 1298
// MISSING LINE 1299
// MISSING LINE 1300
// MISSING LINE 1301
// MISSING LINE 1302
// MISSING LINE 1303
// MISSING LINE 1304
// MISSING LINE 1305
// MISSING LINE 1306
// MISSING LINE 1307
// MISSING LINE 1308
// MISSING LINE 1309
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            {/* Return to Results */}
            <button
              onClick={() => { setSelectedLocation(null); setDetailTab('quality'); }}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Results
            </button>

            {/* Location Header */}
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="min-w-0 space-y-1">
                waterTests.length === 0 && exceedances.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No test data available for this location</p>
                    <p className="text-xs mt-1">The data may not be processed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* At-a-Glance Summary */}
                    {(() => {
                      const microbes = waterTests.filter(t => getParameterCategory(t.contaminant) === 'microbe');
                      const chemicals = waterTests.filter(t => getParameterCategory(t.contaminant) === 'chemical');

                      const isLowRiskParameter = (name: string): boolean => {
                        const norm = name.
// MISSING LINE 1341
// MISSING LINE 1342
// MISSING LINE 1343
// MISSING LINE 1344
    const n = name.toLowerCase();
    for (const [key, risks] of Object.entries(contaminationRisks)) {
      if (n.includes(key)) return risks;
    }
    return [];
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-3">Find Your Water Quality Report</h2>
        <p className="text-sm sm:text-base text-gray-600">Enter a city or water system name to see testing results.</p>
        
        <form onSubmit={handleSearch} className="mt-6 sm:mt-8">
          <div className="relative mb-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. Toronto, London..."
              className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl border-2 border-blue-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-base sm:text-lg pl-12 sm:pl-14"
            />
            <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 sm:w-6 sm:h-6" />
            <button 
              type="submit"
              disabled={searchTerm.length < 2}
              className="absolute right-1.5 sm:right-2 top-1.5 sm:top-2 bottom-1.5 sm:bottom-2 bg-blue-600 text-white px-4 sm:px-6 rounded-lg sm:rounded-xl text-sm sm:text-base font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1 sm:gap-2"
            >
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-1">
            {AVAILABLE_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={cn(
                  "px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-xs font-semibold transition-all border leading-tight",
                  selectedYear === year
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-600"
                )}
              >
                {year}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Results List */}
      <AnimatePresence mode="wait">
        {showResultsList && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-2xl mx-auto space-y-2"
          >
            {results.length === 0 && !loading ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm font-medium">No water systems found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : results.length > 0 ? (
              <>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">
                  {results.length} result{results.length > 1 ? 's' : ''} found
                </h3>
                {results.map((loc) => (
                  <div
                    key={loc.dws_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/search/${encodeURIComponent(queryVal || searchTerm)}/${loc.dws_id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/search/${encodeURIComponent(queryVal || searchTerm)}/${loc.dws_id}`); } }}
                    className="w-full flex items-center justify-between p-4 sm:p-5 rounded-xl border border-gray-100 bg-white hover:border-blue-300 hover:shadow-md transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 shrink-0 transition-colors">
                        <MapPin className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{loc.display_name || titleCase(loc.label || loc.dws_name)}</p>
                        {loc.owner_name && (
                          <p className="text-xs text-gray-500 truncate mt-0.5">
                            {formatOwnerName(loc.owner_name)}
                          </p>
                        )}
                        {loc.sample_types && loc.sample_types.length > 0 && (
                          <p className="text-[10px] text-gray-400 truncate mt-0.5">
                            <span className="font-bold text-gray-500">Water Tested:</span> {formatSampleTypes(loc.sample_types)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {loc.totalTests !== undefined && loc.totalTests > 0 && (
                        <div className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold leading-tight border flex items-center gap-1",
                          loc.exceedances && loc.exceedances > 0
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-700 border-green-200"
                        )}>
                          <span className={cn(
                            "w-1.5 h-1.5 rounded-full",
                            loc.exceedances && loc.exceedances > 0 ? "bg-red-500" : "bg-green-500"
                          )} />
                          {loc.exceedances && loc.exceedances > 0 ? "Attention Required" : "Safe"}
                        </div>
                      )}
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 shrink-0 transition-colors" />
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </motion.div>
        )}

        {/* Detail View with Tabs */}
        {showDetailView && (
          <motion.div
            key={selectedLocation.dws_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            {/* Return to Results */}
            <button
              onClick={() => { navigate(`/search/${encodeURIComponent(queryVal || searchTerm)}`); setDetailTab('quality'); }}
            className="max-w-3xl mx-auto space-y-4 sm:space-y-6"
          >
            {/* Return to Results */}
            <button
              onClick={() => { navigate(`/search/${encodeURIComponent(routeQuery || searchTerm)}`); setDetailTab('quality'); }}
              className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Results
            </button>

            {/* Location Header */}
            <div className="bg-white border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-5">
                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 leading-tight">
                    {selectedLocation.display_name || titleCase(selectedLocation.dws_name)}
                  </h2>
                  {selectedLocation.owner_name && (
                    <p className="text-xs sm:text-base text-gray-500 font-semibold">
                      {formatOwnerName(selectedLocation.owner_name)}
                    </p>
                  )}
                  {selectedLocation.sample_types && selectedLocation.sample_types.length > 0 && (
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      <span className="font-bold text-gray-500">Water Tested:</span> {formatSampleTypes(selectedLocation.sample_types)}
                    </p>
                  )}
                </div>

                <div className="shrink-0 pt-1">
                  {exceedances.length > 0 ? (
                    <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-red-50 text-red-700 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1.5 border border-red-200 shadow-sm uppercase tracking-wider">
                      <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" /> STATUS: EXCEEDANCES DETECTED
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 sm:px-4 sm:py-2 bg-green-50 text-green-700 rounded-full text-[10px] sm:text-xs font-extrabold flex items-center gap-1.5 border border-green-200 shadow-sm uppercase tracking-wider">
                      <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 fill-green-50/10" /> STATUS: ALL-CLEAR & SAFE
                    </span>
                  )}
                </div>
              </div>

              {/* Tab Toggle */}
              <div className="flex gap-1 p-1 bg-gray-100/80 rounded-xl border border-gray-200 mb-6">
                <button
                  onClick={() => setDetailTab('quality')}
                  className={cn(
                    "flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer",
                    detailTab === 'quality' 
                      ? "bg-white text-blue-800 shadow-sm border border-gray-200/50" 
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                  )}
                >
                  Water Quality Data
                </button>
                <button
                  onClick={() => setDetailTab('filters')}
                  className={cn(
                    "flex-1 py-2 px-2 sm:py-2.5 sm:px-3 rounded-lg text-[11px] sm:text-sm font-bold transition-all flex items-center justify-center gap-2 relative cursor-pointer",
                    detailTab === 'filters' 
                      ? "bg-white text-blue-800 shadow-sm border border-gray-200/50" 
                      : "text-gray-500 hover:text-gray-700 bg-transparent"
                  )}
                >
                  Recommended Filters
                  {exceedances.length > 0 && (
                    <span className="w-2 h-2 rounded-full bg-red-500 inline-block animate-pulse" />
                  )}
                </button>
              </div>

              {/* Tab Content */}
              {dataLoading ? (
                <div className="text-center py-10 text-gray-400">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin" />
                  <p className="text-sm">Loading data…</p>
                </div>
              ) : detailTab === 'quality' ? (
                /* ---- TAB: Water Quality Data ---- */
                waterTests.length === 0 && exceedances.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                    <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No test data available for this location</p>
                    <p className="text-xs mt-1">The data may not be processed yet.</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {/* At-a-Glance Summary */}
                    <>
                          {/* At-a-Glance Summary Card Section */}
                          <div className="space-y-2.5 sm:space-y-3">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-950">Summary</h3>
                            <div className="border border-gray-200 bg-gray-50/5 rounded-2xl p-3 sm:p-6 shadow-sm">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                {/* Column 1: Bacteria & Microbes */}
                          <div className="space-y-2.5 sm:space-y-3">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-950">Summary</h3>
                            <div className="border border-gray-200 bg-gray-50/5 rounded-2xl p-3 sm:p-6 shadow-sm">
                              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                {/* Column 1: Bacteria & Microbes */}
                                <div className="flex flex-col space-y-2 sm:space-y-3 pb-4 lg:pb-0 lg:pr-6">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-semibold gap-2">
                                      <span>Safety:</span>
                                      <div className="flex-1 bg-gray-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
                                        <div 
                                          className={cn("h-full rounded-full transition-all duration-500", microbeConfig.color)}
                                          style={{ width: microbeConfig.width }} 
                                        />
                                      </div>
                                    </div>
                                    <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium">
                                      {microbes.length === 0 
                                        ? "No microbe data available." 
                                        : microbeConfig.statusText === "CLEAN"
                                          ? "Tested for E. Coli and Coliforms. All criteria met."
                                          : microbeConfig.statusText === "ELEVATED"
                                            ? "Elevated coliform levels detected. System monitoring recommended."
                                            : "Microbe criteria exceeded. Boiling or purification recommended."}
                                    </p>
                                  </div>
                                </div>

                                {/* Column 2: Heavy Metals & Pollutants */}
                                <div 
                                  onClick={() => setShowMetalsModal(true)}
                                  className="flex flex-col space-y-2 sm:space-y-3 pt-4 lg:pt-0 lg:px-6 p-2 -m-2 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                      <FlaskConical className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-base font-bold text-gray-900 leading-tight">Heavy Metals & Pollutants</h4>
                                      <span className={cn(
                                        "text-[10px] sm:text-xs font-bold uppercase",
                                        chemicalConfig.textColor
                                      )}>
                                        {chemicalConfig.statusText}
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                      <FlaskConical className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-base font-bold text-gray-900 leading-tight">Heavy Metals & Additives</h4>
                                      <span className={cn(
                                        "text-[10px] sm:text-xs font-bold uppercase",
                                        chemicalConfig.textColor
                                      )}>
                                        {chemicalConfig.statusText}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-semibold gap-2 mb-1.5">
                                        <span>Safety:</span>
                                        <div className="flex-1 bg-gray-100 h-1.5 sm:h-2 rounded-full overflow-hidden">
                                          <div 
                                            className={cn("h-full rounded-full transition-all duration-500", chemicalConfig.color)}
                                            style={{ width: chemicalConfig.width }} 
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="pt-2 mt-2 border-t border-gray-100 flex justify-end">
                                      <span className="text-[10px] font-bold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-0.5">
                                        View Details <ChevronRight className="w-3 h-3" />
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Column 3: Water Hardness */}
                                {(() => {
                                  const hasAestheticData = selectedLocation && (selectedLocation.dwsp_data || (hardnessInfo && hardnessInfo.hardness > 0));
                                  const isRegional = selectedLocation?.is_regional_estimate;
                                  const cityName = selectedLocation?.estimate_city_name;

                                  let descriptionText = "No direct data available.";
                                  if (hasAestheticData) {
                                    if (isRegional) {
                                      descriptionText = `No direct data; estimated from ${cityName || "the"} region.`;
                                    } else {
                                      descriptionText = hardnessInfo.userTip;
                                    }
                                    }

                                  return (
                                    <div 
                                      onClick={() => setShowAestheticModal(true)}
                                      className="flex flex-col space-y-2 sm:space-y-3 pt-4 lg:pt-0 lg:pl-6 p-2 -m-2 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm g
// MISSING LINE 1672
// MISSING LINE 1673
// MISSING LINE 1674
// MISSING LINE 1675
// MISSING LINE 1676
// MISSING LINE 1677
// MISSING LINE 1678
// MISSING LINE 1679
// MISSING LINE 1680
                                              "text-[10px] sm:text-xs font-bold uppercase",
                                              hasAestheticData ? hardnessInfo.textColor : "text-gray-400"
                                            )}>
                                              {hasAestheticData ? hardnessInfo.statusText : "NO DATA"}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="space-y-1.5 flex-1 flex flex-col justify-between">
                                        <div>
                                          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-semibold gap-2 mb-1.5">
                                            <span className="shrink-0 text-[10px] font-bold text-gray-400">Soft</span>
                                            <div className="flex-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-400 h-1.5 sm:h-2 rounded-full relative">
                                              {hasAestheticData && (
                                                <div 
                                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-indigo-600 rounded-full shadow absolute -translate-y-1/2 top-1/2 -translate-x-1/2 transition-all duration-500"
                                                  style={{ left: `${hardnessInfo.pct}%` }} 
                                                />
                                              )}
                                            </div>
                                            <span className="shrink-0 text-[10px] font-bold text-gray-400">Hard</span>
                                          </div>
                                          <p className="text-[10px] sm:text-xs text-gray-600 leading-normal font-medium">
                                            {descriptionText}
                                          </p>
                                        </div>

                                        <div className="pt-2 mt-2 border-t border-gray-100 flex justify-end">
                                          <span className="text-[10px] font-bold text-blue-600 group-hover:text-blue-800 transition-colors flex items-center gap-0.5">
                                            View Details <ChevronRight className="w-3 h-3" />
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          {/* Detailed Parameter Check */}
                          <div className="space-y-4">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-950">Detailed Parameter Check</h3>
                            <div className="relative pb-4">
                              <div className="grid grid-cols-1 gap-2.5 sm:gap-3">
                                {(showAllParameters ? sortedWaterTests : sortedWaterTests.slice(0, 6)).map((test, idx) => {
                                  const limitInfo = getOntarioLimitInfo(test.contaminant, test.level, test.unit, test.exceedanceCount || 0, test.parameterLimit);
                                  const isExceeded = limitInfo ? limitInfo.isExceeded : (test.exceedanceCount && test.exceedanceCount > 0);
                                  const category = getParameterCategory(test.contaminant);
                                  const rowKey = `${test.contaminant}_${test.unit}`;
                         
                                  const isExpandable = test.sampleCount > 1;

                                  // Status Text
                                  let statusText = "";
                                  if (isExceeded) {
                                    statusText = "Exceedance Detected";
                                  } else if (test.level === null || test.level === 0) {
                                    statusText = "Safe - Not Detected";
                                  } else {
                                    statusText = "Safe - Low Amount";
                                  }

                                  return (
                                    <div 
                                      key={idx}
                                      className={cn(
                                        "border rounded-xl transition-all overflow-hidden shadow-sm flex flex-col justify-between",
                                        isExceeded 
                                          ? cn("border-red-200 bg-red-50/5", isExpanded && "ring-2 ring-blue-500/10 border-blue-400")
                                          : (test.level !== null && test.level !== 0)
                                            ? cn("border-yellow-200/60 bg-yellow-50/20", isExpanded ? "ring-2 ring-blue-500/10 border-blue-400" : "hover:border-yellow-300")
                                            : cn("border-gray-100 bg-white", isExpanded ? "ring-2 ring-blue-500/10 border-blue-400" : "hover:border-gray-200 hover:shadow-md")
                                      )}
                                    >
                                      {/* Row Content (Horizontal on all screen sizes) */}
                                      <div 
                                        onClick={() => toggleRowExpansion(test.contaminant, test.unit)}
                                        className="p-3 sm:p-4 flex flex-row items-center justify-between gap-4 cursor-pointer select-none"
                                      >
                                      {microbes.length === 0 
                                        ? "No microbe data available." 
                                        : microbeConfig.statusText === "CLEAN"
                                          ? "Tested for E. Coli and Coliforms. All criteria met."
                                          : microbeConfig.statusText === "ELEVATED"
                                            ? "Elevated coliform levels detected. System monitoring recommended."
                                            : "Microbe criteria exceeded. Boiling or purification recommended."}
                                    </p>
                                  </div>
                                </div>

                                {/* Column 2: Heavy Metals & Additives */}
                                <div 
                                  onClick={() => setShowMetalsModal(true)}
                                  className="flex flex-col space-y-2 sm:space-y-3 pt-4 lg:pt-0 lg:px-6 p-2 -m-2 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200"
                                >
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                      <FlaskConical className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-base font-bold text-gray-900 leading-tight">Heavy Metals & Additives</h4>
                                      <span className={cn(
                                        "text-[10px] sm:text-xs font-bold uppercase",
                                        chemicalConfig.textColor
                                      )}>
                            
// MISSING LINE 1788
// MISSING LINE 1789
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">What is it?</p>
                                                  <p className="text-gray-600 leading-snug font-sans font-semibold sm:font-medium text-[9px] sm:text-xs">
                                                    {renderDescriptionWithHighlights(getParameterDescription(test.contaminant))}
                                                  </p>
                                                </div>
                                              </div>

                                              {/* Lazy-loaded history list inside the card */}
                                              {isExpandable && (
                                                <div className="space-y-1.5 pt-1">
                                            transition={{ duration: 0.2, ease: "easeInOut" }}
                                            className="border-t border-gray-100 bg-gray-50/50"
                                          >
                                            <div className="p-2 sm:p-4 space-y-2 sm:space-y-3 text-[10px] sm:text-xs text-gray-600">
                                              <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 bg-white p-2 sm:p-3 rounded-lg border border-gray-100 shadow-sm leading-snug">
                                                <div>
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">
                                                    {isExceeded ? "Highest Amount Detected" : "Average Amount Found"}
                                                  </p>
                                                  <p className="font-mono font-bold text-[10px] sm:text-sm text-gray-900">
                                                    {isExceeded
                                                      ? formatLevel(test.maxLevel !== undefined && test.maxLevel !== null ? test.maxLevel : test.level, test.unit, test.exceedanceCount || 0)
                                                      : formatLevel(test.level, test.unit, test.exceedanceCount || 0)
                                                    }
                                               
                                  const isRegional = selectedLocation?.is_regional_estimate;
                                  const cityName = selectedLocation?.estimate_city_name;

                                  let descriptionText = "No direct data available.";
                                  if (hasAestheticData) {
                                    if (isRegional) {
                                      descriptionText = `No direct data; estimated from ${cityName || "the"} region.`;
                                    } else {
                                      descriptionText = hardnessInfo.userTip;
                                    }
                                    }

                                  return (
                                    <div 
                                      onClick={() => setShowAestheticModal(true)}
                                      className="flex flex-col space-y-2 sm:space-y-3 pt-4 lg:pt-0 lg:pl-6 p-2 -m-2 cursor-pointer hover:bg-gray-50/80 active:bg-gray-100/85 rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm group relative transition-all duration-200"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 sm:gap-3">
                                          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                                            <Droplet className="w-4.5 h-4.5 sm:w-6 sm:h-6 fill-indigo-600/10" />
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                                })}
                                                <div className="col-span-2 pt-1 border-t border-gray-50">
                                                  <p className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 font-sans">What is it?</p>
                                                  <p className="text-gray-600 leading-snug font-sans font-semibold sm:font-medium text-[9px] sm:text-xs">
                                                    {renderDescriptionWithHighlights(getParameterDescription(test.contaminant))}
                                                  </p>
                                          <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-500 font-semibold gap-2 mb-1.5">
                                            <span className="shrink-0 text-[10px] font-bold text-gray-400">Soft</span>
                                            <div className="flex-1 bg-gradient-to-r from-blue-200 via-indigo-200 to-purple-400 h-1.5 sm:h-2 rounded-full relative">
                                              {hasAestheticData && (
                                                <div 
                                                  className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white border border-indigo-600 rounded-full shadow absolute -translate-y-1/2 top-1/2 -translate-x-1/2 transition-all duration-500"
                                                  style={{ left: `${hardnessInfo.pct}%` }} 
                                                />
                                              )}
                                            </div>
                                  >
                                    Show All Parameters ({sortedWaterTests.length}) <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Show Less option below the list */}
                            {showAllParameters && sortedWaterTests.length > 6 && (
                              <div className="flex justify-center pt-2">
                                <button
                                  onClick={() => setShowAllParameters(false)}
                                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                                >
                                  Show Less <ChevronDown className="w-3.5 h-3.5 rotate-180" />
                                </button>
                              </div>
                            )}
                          </div>

                          {/* Health & Action Advice */}
                          <div className="space-y-3 sm:space-y-4 pt-2">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-950">Health & Action Advice</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap
                              {/* Health Card */}
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-start gap-2.5 sm:gap-3 shadow-inner">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0 shadow-sm">
                                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-green-500 text-green-500" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Health</h4>
                                  <p className="text-[11px] sm:text-sm text-gray-700 leading-normal font-semibold">
                                    {exceedances.length > 0
                                      ? "Exceedance found. We recommend filtered water or checking local public health advisories."
                                      : "No immediate health risks associated with drinking this water."}
                                  </p>
                                </div>
                              </div>

                              {/* Filters Card */}
                                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-500" />
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">Updates</h4>
                                  <p className="text-[11px] sm:text-sm text-gray-700 leading-normal font-semibold">
                                    Last sampled: <span className="text-gray-950 font-bold">{getLatestSampleDate()}</span>.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </>
                  </div>
                )
              ) : (
                /* ---- TAB: Recommended Filters ---- */
                (() => {
                  const rawRecs = recommendFiltersSmart(waterTests, exceedances);
                  const recs = rawRecs.map((r: any) => ({ ...r, ...filterRecDisplay(r) }));

                  if (recs.length === 0) {
                    return (
                      <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
                        <Filter className="w-10 h-10 mx-auto mb-2 opacity-50" />
                        <p className="text-sm font-medium">No filter recommendations available</p>
                        <p className="text-xs mt-1">Test data is needed to generate personalized filter suggestions.</p>
                      </div>
                    );
                  }

                   const primaryRec = recs[0];
                  const secondaryRecs = recs.slice(1);
                  const amazonProduct = getAmazonProducts(primaryRec.primary)[0];

                  const detectedParams = waterTests.filter(t => {
                    const limitInfo = getOntarioLimitInfo(t.contaminant, t.level, t.unit, t.exceedanceCount || 0, t.parameterLimit);
                    const isExceeded = limitInfo ? limitInfo.isExceeded : (t.exceedanceCount && t.exceedanceCount > 0);
                    return isExceeded || (t.level !== null && t.level > 0);
                  });

                  return (
                    <div className="space-y-6">
                      {/* Featured Primary Filter Box */}
                      <div className="border border-blue-200 rounded-2xl p-5 sm:p-7 bg-gradient-to-br from-blue-50/20 via-white to-blue-50/10 shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center text-lg font-black shadow-sm">
                              {primaryRec.icon}
                            </div>
                            <div>
                              <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded uppercase tra
                  const amazonProduct = getAmazonProducts(primaryRec.primary)[0];

                  const detectedParams = waterTests.filter(t => {
                                {primaryRec.primary}
                              </h4>
                            </div>
                          </div>
                          <span className={cn(
                            "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shrink-0 sm:self-start self-start",
                            primaryRec.primary.includes("Reverse Osmosis") 
                              ? "bg-purple-50 text-purple-700 border-purple-200"
                              : primaryRec.primary.includes("Carbon")
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            Highly Recommended
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-750 leading-relaxed font-medium">
                          {primaryRec.why}
                        </p>
                        <div className="mt-3.5">
                          <a
                            href={amazonProduct.link}
                            target="_blank"
                            rel="noopener noreferrer"
                                {amazonProduct.name}
                              </span>
                            </span>
                            <ExternalLink className="w-3 h-3 text-blue-500 shrink-0" />
                          </a>
                        </div>
                        {primaryRec.warning && (
                          <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2.5">
                            <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="text-[11px] text-red-800 leading-relaxed font-semibold">{primaryRec.warning}</p>
                          </div>
                        )}
                      </div>

                      {/* Secondary Recommendations (if any) */}
                      {secondaryRecs.length > 0 && (
                        <div className="space-y-3">
                          <h5 className="text-xs sm:text-sm font-extrabold text-gray-400 uppercase tracking-wider">Secondary Recommendations</h5>
                          <div className="grid grid-cols-1 gap-3">
                            {secondaryRecs.map((rec: any) => (
                              <div key={rec.primary} className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm flex items-start gap-3 justify-between">
                                <div className="flex items-start gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center font-black shrink-0 text-sm">
                                    {rec.icon}
                                  </div>
                                  <div>
                                    <h5 className="text-xs sm:text-sm font-bold text-gray-900">{rec.primary}</h5>
                                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{rec.tagline}</span>
                                    <p className="text-[11px] sm:text-xs text-gray-500 mt-1 leading-relaxed">{rec.why}</p>
                                  </div>
                                </div>
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold shrink-0 self-start ${rec.badgeBg}`}>{rec.badgeText}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Detected Contaminants section */}
                      <div className="pt-6 border-t border-gray-100 space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-bold text-gray-950 text-sm sm:text-base">
                            Contaminants found:{" "}
                            <span className={cn(
                              "text-base sm:text-lg font-black",
                              exceedances.length > 0 ? "text-red-600" : "text-yellow-500"
                            )}>

                            Contaminants found:{" "}
                            <span className={cn(
                              "text-base sm:text-lg font-black",
                              exceedances.length > 0 ? "text-red-600" : "text-yellow-500"
                            )}>
                              {detectedParams.length}
// MISSING LINE 2031
// MISSING LINE 2032
// MISSING LINE 2033
// MISSING LINE 2034
// MISSING LINE 2035
// MISSING LINE 2036
// MISSING LINE 2037
// MISSING LINE 2038
// MISSING LINE 2039
            <p className="text-sm sm:text-base text-gray-500">Enter a city or water system name above to see detailed contaminant levels and safety guidelines.</p>
          </motion.div>
        )}
        {/* Aesthetic Impacts Modal */}
        {showAestheticModal && (
                        <div className="relative">
                          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {detectedParams.length === 0 ? (
                              <div className="col-span-full py-4 text-center text-xs text-gray-400 font-medium">
                                No contaminants detected in trace or exceeded amounts.
                              </div>
                            ) : (
                              (showAllContaminants ? detectedParams : detectedParams.slice(0, isMobile ? 4 : 8)).map((param, pIdx) => {
                                const limitInfo = getOntarioLimitInfo(param.contaminant, param.level, param.unit, param.exceedanceCount || 0, param.parameterLimit);
                                const isExceeded = limitInfo ? limitInfo.isExceeded : (param.exceedanceCount && param.exceedanceCount > 0);
                                const filterTarget = getContaminantFilterTarget(param.contaminant);

                                return (
                                  <motion.div
                                    layout
                                    key={pIdx}
                                    className={cn(
                                      "border rounded-xl p-3 select-none shadow-sm flex flex-col justify-center",
                                      isExceeded
                                        ? "border-red-200 bg-red-50/10"
                                        : "border-yellow-200/50 bg-yellow-50/10",
                                      "sm:aspect-square sm:text-center"
                                    )}
                                  >
                                    <div className="flex flex-col w-full text-left sm:items-center sm:text-center gap-1.5 sm:gap-2">
                                      {/* Contaminant Name */}
                                      <span className={cn(
                                        "font-extrabold text-[11px] sm:text-base leading-snug truncate sm:whitespace-normal sm:line-clamp-2",
                                        isExceeded ? "text-red-600" : "text-amber-600"
                            ) : (
                              (showAllContaminants ? detectedParams : detectedParams.slice(0, isMobile ? 4 : 8)).map((param, pIdx) => {
                                const limitInfo = getOntarioLimitInfo(param.contaminant, param.level, param.unit, param.exceedanceCount || 0, param.parameterLimit);
                                const isExceeded = limitInfo ? limitInfo.isExceeded : (param.exceedanceCount && param.exceedanceCount > 0);
                                const filterTarget = getContaminantFilterTarget(param.contaminant);

                                return (
                                  <motion.div
                                    layout
                                    key={pIdx}
                                    className={cn(
                                      "border rounded-xl p-3 select-none shadow-sm flex flex-col justify-center",
                                      isExceeded
                                        ? "border-red-200 bg-red-50/10"
                                        : "border-yellow-200/50 bg-yellow-50/10",
                                      "sm:aspect-square sm:text-center"
                                    )}
                )
              ) : (
                /* ---- TAB: Recommended Filters ---- */
                (() => {
                  const rawRecs = recommendFiltersSmart(waterTests, exceedances);
                  const recs = rawRecs.map((r: any) => ({ ...r, ...filterRecDisplay(r) }));

                  if (recs.length === 0) {
                    return (
                      <div className="text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl">
// MISSING LINE 2101
// MISSING LINE 2102
// MISSING LINE 2103
// MISSING LINE 2104
// MISSING LINE 2105
// MISSING LINE 2106
// MISSING LINE 2107
// MISSING LINE 2108
// MISSING LINE 2109
                              ) : (
                                <button
                                  onClick={() => setShowAllContaminants(true)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer"
                                >
                                  {isMobile ? (
                                    <>Show More <ChevronDown className="w-3.5 h-3.5" /></>
                                  ) : (
                                    <>Show All ({detectedParams.length}) <ChevronDown className="w-3.5 h-3.5" /></>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                  );
                })()
              )}
            </div>

            {/* Return to Results (bottom) */}
            <div className="text-center pt-2">
              <button
                onClick={() => { navigate(`/search/${encodeURIComponent(queryVal || searchTerm)}`); setDetailTab('quality'); }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Return to Results
              </button>
            </div>
          </motion.div>
        )}

        {/* Initial empty state */}
        {!hasSearched && !selectedLocation && (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg mx-auto text-center bg-blue-50/50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12"
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-lg mx-auto text-center bg-blue-50/50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-200">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Search for a location</h3>
            <p className="text-sm sm:text-base text-gray-500">Enter a city or water system name above to see detailed contaminant levels and safety guidelines.</p>
          </motion.div>
        )}
        {/* Heavy Metals & Additives Modal */}
        {showMetalsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMetalsModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <FlaskConical className="w-5 h-5 text-blue-600 fill-blue-600/10 shrink-0" />
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Heavy Metals & Pollutants</span>
                </div>
                <button
                  onClick={() => setShowMetalsModal(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-full cursor-pointer z-20"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Container */}
              <div className="bg-gradient-to-b from-blue-50/50 via-blue-100/10 to-white flex-1 overflow-y-auto p-5 space-y-6">
                
                {/* Centered Big Header */}
                <div className="space-y-2 text-center py-2">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight px-1">
                    Heavy Metals & Pollutants
                  </h3>
                  <p className="text-[9px] sm:text-xs text-slate-500 font-semibold leading-relaxed px-4">
                    Analysis of regulated metals, chemical runoffs, and active treatment sanitizers in your water system.
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in duration-200"
            >
              {/* Fixed Title Bar */}
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrin
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Search for a location</h3>
            <p className="text-sm sm:text-base text-gray-500">Enter a city or water system name above to see detailed contaminant levels and safety guidelines.</p>
          </motion.div>
            className="max-w-lg mx-auto text-center bg-blue-50/50 border border-blue-100 rounded-2xl sm:rounded-3xl p-8 sm:p-12"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-200">
              <Search className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-2">Search for a location</h3>
            <p className="text-sm sm:text-base text-gray-500">Enter a city or water system name above to see detailed contaminant levels and safety guidelines.</p>
          </motion.div>
        )}
        {/* Aesthetic Impacts Modal */}
        {showAestheticModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAestheticModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overfl
// MISSING LINE 2237
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Heavy Metals & Pollutants</h4>
                      </div>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border border-slate-200/55",
                        chemicalConfig.textColor === "text-green-600"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : chemicalConfig.textColor === "text-amber-500"
                            ? "bg-orange-100 text-orange-800 border-orange-200"
                            : "bg-red-100 text-red-800 border-red-200"
                      )}>
                        {chemicalConfig.statusText}
                      </span>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                          <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Safety & Regulation</span>
                        </div>
                        <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                          Exposure to toxic heavy metals (such as lead, arsenic, and mercury) or chemical runoffs (such as nitrates and nitrites) is highly regulated by provincial authorities to prevent developmental and kidney risks.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0" />
                          <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Compliance Status</span>
                        </div>
                        <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                          {chemicals.length === 0 
                            ? "No chemical pollutant measurements are available for the selected year." 
                            : chemicalConfig.statusText === "LOW LEVELS"
                              ? "All tested heavy metals, chemical pollutants, and industrial compounds in your system currently meet safety compliance guidelines."
                              : "Elevated levels detected for some pollutants. A specialized Reverse Osmosis filtration system is recommended to remove trace contaminants."}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 
                  <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Additives & Sanitizers</h4>
                      </div>
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border border-slate-200/55",
                        additiveConfig.textColor === "text-green-600"
                          ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                          : "bg-red-100 text-red-800 border-red-200"
                          Municipal treatment facilities add specific sanitizers like chlorine to destroy pathogenic microbes, and add minerals like fluoride (generally targeted at 0.5 to 0.8 mg/L) to support community dental health.
                        </p>
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4.5 h-4.5 text-cyan-600 shrink-0" />
                          <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">Active Levels</span>
                        </div>
                        <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                          {getAdditivesDescription(additives)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          </div>
        )}

        {/* Aesthetic Impacts Modal */}
        {showAestheticModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAestheticModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            {/* Modal Content */}
        {/* Aesthetic Impacts Modal */}
        {showAestheticModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAestheticModal(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              className="bg-slate-50/95 rounded-[32px] max-w-md w-full shadow-2xl relative border border-slate-100 max-h-[90vh] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in duration-200"
            >
              {/* Fixed Title Bar */}
              <div className="bg-white px-5 py-4 border-b border-slate-100/80 flex items-center justify-between shrink-0 z-20">
                <div className="flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-600 fill-blue-600/10 shrink-0" />
                  <span className="font-extrabold text-slate-800 text-xs sm:text-sm">Everyday Impacts</span>
                </div>
      
// MISSING LINE 2352
// MISSING LINE 2353
// MISSING LINE 2354
// MISSING LINE 2355
// MISSING LINE 2356
// MISSING LINE 2357
// MISSING LINE 2358
// MISSING LINE 2359
// MISSING LINE 2360
// MISSING LINE 2361
// MISSING LINE 2362
// MISSING LINE 2363
// MISSING LINE 2364
// MISSING LINE 2365
// MISSING LINE 2366
// MISSING LINE 2367
// MISSING LINE 2368
// MISSING LINE 2369
// MISSING LINE 2370
// MISSING LINE 2371
// MISSING LINE 2372
// MISSING LINE 2373
// MISSING LINE 2374
// MISSING LINE 2375
                    Specific data was not found for this region, so we estimate based on the surrounding {selectedLocation.estimate_city_name || "local"} municipal water data!
                  </div>
                )}

                {selectedLocation && (selectedLocation.dwsp_data || (hardnessInfo && hardnessInfo.hardness > 0)) ? (
                  <div className="space-y-5">
                    {/* Card 1: Water Hardness */}
                    {(() => {
                      const hardness = hardnessInfo.hardness;
                      const status = hardnessInfo.statusText;
                      
                      let badgeText = status;
                      let badgeColors = "bg-slate-100 text-slate-800";
                      let circleBgAndText = "bg-slate-100 text-slate-600";
                      let iconColor = "text-indigo-600";
                      let bullets: { lucideIcon: any; label: string; description: string }[] = [];
                      
                      if (status === "Soft Water") {
                        badgeColors = "bg-emerald-100 text-emerald-800 border-emerald-200";
                        circleBgAndText = "bg-emerald-50 text-emerald-600";
                        iconColor = "text-emerald-600";
                      } else if (status === "Moderately Hard") {
                        badgeColors = "bg-blue-100 text-blue-800 border-blue-200";
                        circleBgAndText = "bg-blue-50 text-blue-600";
                        iconColor = "text-blue-600";
                      } else if (status === "Hard Water") {
                        badgeColors = "bg-orange-100 text-orange-800 border-orange-200";
                        circleBgAndText = "bg-orange-50 text-orange-600";
                        iconColor = "text-orange-600";
                      } else if (status === "Very Hard Water") {
                        badgeColors = "bg-purple-100 text-purple-800 border-purple-200";
                        circleBgAndText = "bg-purple-50 text-purple-600";
                        iconColor = "text-purple-600";
                      }

                      if (status === "Soft Water" || status === "Moderately Hard" || status === "Hard Water" || status === "Very Hard Water") {
                        bullets = [
                          { lucideIcon: Smile, label: "What It Feels Like", description: hardnessInfo.feelsLike },
                          { lucideIcon: Wrench, label: "Practical Advice", description: hardnessInfo.practicalAdvice }
                        ];
                      } else {
                        bullets = [
                          { lucideIcon: AlertTriangle, label: "Status", description: "Hardness measurements are not currently tracked or calculated for this location." }
                        ];
                      }
                      
                      return (
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", circleBgAndText)}>
                                <Waves className="w-5 h-5" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Water Hardness & Minerals</h4>
                            </div>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border border-slate-200/55", badgeColors)}>
                              {badgeText}
                            </span>
                          </div>
                          
                          <div className="space-y-4">
                            {bullets.map((b, idx) => (
                              <div key={idx} className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <b.lucideIcon className={cn("w-4.5 h-4.5 shrink-0", iconColor)} />
        
// MISSING LINE 2442
// MISSING LINE 2443
// MISSING LINE 2444
// MISSING LINE 2445
// MISSING LINE 2446
// MISSING LINE 2447
// MISSING LINE 2448
// MISSING LINE 2449
// MISSING LINE 2450
// MISSING LINE 2451
// MISSING LINE 2452
// MISSING LINE 2453
// MISSING LINE 2454
// MISSING LINE 2455
// MISSING LINE 2456
// MISSING LINE 2457
// MISSING LINE 2458
// MISSING LINE 2459
// MISSING LINE 2460
// MISSING LINE 2461
// MISSING LINE 2462
// MISSING LINE 2463
// MISSING LINE 2464
// MISSING LINE 2465
// MISSING LINE 2466
// MISSING LINE 2467
// MISSING LINE 2468
// MISSING LINE 2469
// MISSING LINE 2470
// MISSING LINE 2471
// MISSING LINE 2472
// MISSING LINE 2473
// MISSING LINE 2474
// MISSING LINE 2475
// MISSING LINE 2476
// MISSING LINE 2477
// MISSING LINE 2478
                        ];
                      } else {
                        badgeText = "NORMAL";
                        badgeColors = "bg-emerald-100 text-emerald-800";
                        circleBgAndText = "bg-emerald-50 text-emerald-600";
                        bullets = [
                          { lucideIcon: Coffee, label: "Taste & Odor", description: "Fresh, clean taste. Completely free of metallic aftertaste or unpleasant odors." },
                          { lucideIcon: CheckCircle2, label: "Staining Risk", description: "Zero staining risk. Porcelain sinks, toilet bowls, and white laundry stay perfectly clean." }
                        ];
                      }
                      
                      return (
                        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex flex-col space-y-4">
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0", circleBgAndText)}>
                                <FlaskConical className="w-5 h-5" />
                              </div>
                              <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm leading-tight">Iron Content & Staining</h4>
                            </div>
                            <span className={cn("px-2.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider leading-none border border-slate-200/55", badgeColors)}>
                              {badgeText}
                                <span className="text-slate-600">Current pH: {phVal.toFixed(1)}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-gray-400 font-bold pt-2 border-t border-slate-100/50">
                            <span>Optimal Range: 6.5 - 8.5 pH</span>
                            {hasPh && <span>System Average: {phVal.toFixed(2)} pH</span>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center text-xs text-slate-500 font-semibold leading-relaxed my-4">
                    Aesthetic data not explicitly tracked for this specific facility pipeline. Water is regulated under provincial baseline compliance guidelines.
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
// MISSING LINE 2528
// MISSING LINE 2529
// MISSING LINE 2530
// MISSING LINE 2531
// MISSING LINE 2532
// MISSING LINE 2533
// MISSING LINE 2534
// MISSING LINE 2535
// MISSING LINE 2536
// MISSING LINE 2537
// MISSING LINE 2538
// MISSING LINE 2539
// MISSING LINE 2540
// MISSING LINE 2541
// MISSING LINE 2542
// MISSING LINE 2543
// MISSING LINE 2544
// MISSING LINE 2545
// MISSING LINE 2546
// MISSING LINE 2547
// MISSING LINE 2548
// MISSING LINE 2549
// MISSING LINE 2550
// MISSING LINE 2551
// MISSING LINE 2552
// MISSING LINE 2553
// MISSING LINE 2554
// MISSING LINE 2555
// MISSING LINE 2556
// MISSING LINE 2557
// MISSING LINE 2558
// MISSING LINE 2559
// MISSING LINE 2560
// MISSING LINE 2561
// MISSING LINE 2562
// MISSING LINE 2563
// MISSING LINE 2564
// MISSING LINE 2565
// MISSING LINE 2566
// MISSING LINE 2567
// MISSING LINE 2568
// MISSING LINE 2569
// MISSING LINE 2570
// MISSING LINE 2571
// MISSING LINE 2572
// MISSING LINE 2573
// MISSING LINE 2574
// MISSING LINE 2575
// MISSING LINE 2576
// MISSING LINE 2577
// MISSING LINE 2578
                                  />
                                </div>
                                <span className="shrink-0 text-purple-600 font-extrabold">Alkaline (14)</span>
                              </div>
                              <div className="flex justify-between items-center text-[8px] sm:text-[9px] text-slate-400 font-black px-1">
                                <span>Neutral (7)</span>
                                <span className="text-slate-600">Current pH: {phVal.toFixed(1)}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-[8px] sm:text-[10px] text-gray-400 font-bold pt-2 border-t border-slate-100/50">
                            <span>Optimal Range: 6.5 - 8.5 pH</span>
                            {hasPh && <span>System Average: {phVal.toFixed(2)} pH</span>}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 text-center text-xs text-slate-500 font-semibold leading-relaxed my-4">
                    Aesthetic data not explicitly tracked for this specific facility pipeline. Water is regulated under provincial baseline compliance guidelines.
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
