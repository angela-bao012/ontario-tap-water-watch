# Walkthrough - Summary Bar Additives & Lazy Loaded History

We have successfully implemented the "Water Additives & Treatment" summary card and optimized parameter details to lazy load the individual measurements history list.

## Changes Made

### Frontend Changes

#### [Search.tsx](file:///Users/angelabao/ontario-tap-water-watch/src/pages/Search.tsx)
- **Categorization (`getParameterCategory`)**: Extended parameter categories to include a new `'additive'` class for `Fluoride`, `Trihalomethanes (total)`, `Total Haloacetic acids`, `Chlorate`, `Chlorite`, and `chlorine`.
- **Icon styling (`getParameterIcon`)**: Created a dedicated `Sparkles` icon with cyan styling for the new `'additive'` parameters.
- **At-a-Glance Summary (4-Column Layout)**:
  - Resized the grid layout from 3 to 4 columns on large screens.
  - Renamed and refocused Column 2 from "Heavy Metals & Chemicals" to **Heavy Metals & Pollutants** (representing toxic contaminants like Lead, Arsenic, and Nitrate).
  - Added **Water Additives & Treatment** as Column 3, displaying a green/red safety indicator and status text ("OPTIMAL", "SAFE", or "EXCESSIVE").
  - Dynamically format the description of additives in the card (e.g. `Fluoride: 0.54 mg/L | Chlorine Byproducts: ...` with optimal/safe guidelines).
  - Realigned Column 4: **Water Hardness & Minerals** (shifted from Column 3) to render and modal-trigger correctly.
- **Lazy Loaded History List**:
  - Decoupled the parameter row toggle from the raw sample data fetching. Expanding a row is now instantaneous.
  - Added a "Show Past Samples (N)" button to the expanded parameter card.
  - Clicking this button triggers `loadPastSamples`, displaying a loading spinner and then dynamically rendering the list of past measurements.

---

## Verification & Validation

### Automated Validation
- **TypeScript Typecheck**: Ran `npm run lint` (`tsc --noEmit`), which compiled successfully with 0 errors.

### Manual Verification
- Opened local server at `http://localhost:3000/search` and searched for **Windsor**.
- Verified the new 4-column summary bar. The **Additives & Treatment** card correctly displayed a status of **OPTIMAL** with Fluoride at `0.54 mg/L`.
- Scrolled down to **Nitrate (as nitrogen)**, clicked to expand, and confirmed that the raw samples were NOT loaded immediately.
- Clicked the **Show Past Samples** button and verified that the history loaded dynamically.

Below is a screenshot of the expanded Nitrate card with the loaded sample history:

![Nitrate Sample History](/Users/angelabao/.gemini/antigravity-ide/brain/184bc496-867e-459e-bad4-eb9403a76491/nitrate_sample_history_1780580835001.png)

    ph_avg: number | null;
  } | null;
  is_regional_estimate?: boolean;
  esti
  - URL updates to `/search/Windsor`.
  - While loading, a "Searching for water systems..." spinner is displayed.
  - Results appear instantly.
- Click "CITY OF WINDSOR DRINKING WATER SYSTEM". Verify:
  - URL updates to `/search/Windsor/210000041` (or Windsor's DWS ID).
  - Details and summary cards load.
- Expand a parameter card (e.g. Fluoride). Verify it opens instantly without network requests, and clicking "Show Past Samples" loads the measurements list.

}

interface WaterDataResponse {
  location: any;
  tests: WaterTest[];
  exceedances: Exceedance[];
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
// MISSING LINE 580
// MISSING LINE 581
// MISSING LINE 582
// MISSING LINE 583
// MISSING LINE 584
// MISSING LINE 585
// MISSING LINE 586
// MISSING LINE 587
// MISSING LINE 588
// MISSING LINE 589
// MISSING LINE 590
// MISSING LINE 591
// MISSING LINE 592
// MISSING LINE 593
// MISSING LINE 594
// MISSING LINE 595
// MISSING LINE 596
// MISSING LINE 597
// MISSING LINE 598
// MISSING LINE 599
// MISSING LINE 600
// MISSING LINE 601
// MISSING LINE 602
// MISSING LINE 603
// MISSING LINE 604
// MISSING LINE 605
// MISSING LINE 606
// MISSING LINE 607
// MISSING LINE 608
// MISSING LINE 609
// MISSING LINE 610
// MISSING LINE 611
// MISSING LINE 612
// MISSING LINE 613
// MISSING LINE 614
// MISSING LINE 615
// MISSING LINE 616
// MISSING LINE 617
// MISSING LINE 618
// MISSING LINE 619
// MISSING LINE 620
// MISSING LINE 621
// MISSING LINE 622
// MISSING LINE 623
// MISSING LINE 624
// MISSING LINE 625
// MISSING LINE 626
// MISSING LINE 627
// MISSING LINE 628
// MISSING LINE 629
// MISSING LINE 630
// MISSING LINE 631
// MISSING LINE 632
// MISSING LINE 633
// MISSING LINE 634
// MISSING LINE 635
// MISSING LINE 636
// MISSING LINE 637
// MISSING LINE 638
// MISSING LINE 639
// MISSING LINE 640
// MISSING LINE 641
// MISSING LINE 642
// MISSING LINE 643
// MISSING LINE 644
// MISSING LINE 645
// MISSING LINE 646
// MISSING LINE 647
// MISSING LINE 648
// MISSING LINE 649
// MISSING LINE 650
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
  const [searchTerm, setSearchTerm] = useState(routeQuery || searchParams.get("q") || "");
  const [selectedYear, setSelectedYear] = useState<number>(2025);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationResult[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<LocationResult | null>(null);
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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    setIsMobile(media.matches);
    const listener = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, []);

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
      lower.includes('temperature') ||
      lower.includes('chlorine residual')
    ) {
      return 'aesthetic';
    }
    return 'chemical';
  };

  const getParameterIcon = (category: 'microbe' | 'chemical' | 'aesthetic') => {
    switch (category) {
      case 'microbe':
        return (
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

  const getLatestSampleDate = () => {
    if (exceedances && exceedances.length > 0) {
      const dates = exceedances.map(e => new Date(e.sample_date)).filter(d => !isNaN(d.getTime()));
      if (dates.length > 0) {
        const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
        return maxDate.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
      }
    }
    return `Oct 12, ${selectedYear}`;
  };

  const getNextSampleDateStr = (latestStr: string) => {
    const d = new Date(latestStr);
    if (!isNaN(d.getTime())) {
      d.setMonth(d.getMonth() + 3);
      return d.toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' });
    }
    return `Jan 12, ${selectedYear + 1}`;
  };

  const getSortTier = (t: WaterTest) => {
    const limitInfo = getOntarioLimitInfo(t.contaminant, t.level, t.unit, t.exceedanceCount || 0, t.parameterLimit);
    const isExceeded = limitInfo ? limitInfo.isExceeded : (t.exceedanceCount && t.exceedanceCount > 0);
    if (isExceeded) return 0;
    if (t.level !== null && t.level > 0) return 1;
    return 2;
  };

  const sortedWaterTests = [...waterTests].sort((a, b) => {
    const tierA = getSortTier(a);
    const tierB = getSortTier(b);
    if (tierA !== tierB) return tierA - tierB;
    
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
    setExpandedRows(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const loadPastSamples = async (contaminant: string, unit: string) => {
    const key = `${contaminant}_${unit}`;
    if (rawSamplesData[key] || r
        if (res.ok) {
          const data = await res.json();
          const filteredData = (data || []).filter((item: any) => {
            const u1 = formatUnitForDisplay(item.result_unit || "").toLowerCase().trim();
            const u2 = formatUnitForDisplay(unit || "").toLowerCase().trim();
            const unitMatch = u1 === u2;
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm || searchTerm.length < 2) return;
    setLoading(true);
    setSelectedLocation(null);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/water-data?distinct_locations=true&q=${encodeURIComponent(searchTerm)}&year=${selectedYear}`);
      const data = await res.json();
      setResults(data || []);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };
// MISSING LINE 876
// MISSING LINE 877
// MISSING LINE 878
// MISSING LINE 879
// MISSING LINE 880
// MISSING LINE 881
// MISSING LINE 882
// MISSING LINE 883
// MISSING LINE 884
// MISSING LINE 885
// MISSING LINE 886
// MISSING LINE 887
// MISSING LINE 888
// MISSING LINE 889
// MISSING LINE 890
// MISSING LINE 891
// MISSING LINE 892
// MISSING LINE 893
// MISSING LINE 894
// MISSING LINE 895
// MISSING LINE 896
// MISSING LINE 897
// MISSING LINE 898
// MISSING LINE 899
// MISSING LINE 900
// MISSING LINE 901
// MISSING LINE 902
// MISSING LINE 903
// MISSING LINE 904
// MISSING LINE 905
// MISSING LINE 906
// MISSING LINE 907
// MISSING LINE 908
// MISSING LINE 909
    return (
      <div className="text-center text-[8px] sm:text-[10px] text-gray-400 py-2.5 bg-white rounded-md sm:rounded-lg border border-gray-100">
        No sample history available.
      </div>
    );
  };

  const handleSearch = async (e: React.FormEvent) => {
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
      console.error("Fetch tests error:", error);
      setWaterTests([]);
      setExceedances([]);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    const syncUrlState = async () => {
      if (routeQuery && routeQuery.length >= 2) {
        setHasSearched(true);
        setLoading(true);
        try {
          const res = await fetch(`/api/water-data?distinct_locations=true&q=${encodeURIComponent(routeQuery)}&year=${selectedYear}`);
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
  }, [routeQuery, routeDwsId, selectedYear]);

  // Show results list or detail view — never both
  const showResultsList = hasSearched && !selectedLocation;
  const showDetailView = selectedLocation;

  // ---- Smart filter recommendation logic (uses exceedances + test levels) ----
  type FilterRec = {
  };

  const recommendFiltersSmart = (waterTests: WaterTest[], exceedances: Exceedance[]) => {
    const recs: Record<string, { score: number; tag: string; warning: string | null }> = {};

    const paramNames = new Set([
      ...exceedances.map(e => (e.parameter_name || "").toLowerCase()),
      ...waterTests.map(t => (t.contaminant || "").toLowerCase()),
    ]);

// MISSING LINE 1011
// MISSING LINE 1012
// MISSING LINE 1013
// MISSING LINE 1014
// MISSING LINE 1015
// MISSING LINE 1016
// MISSING LINE 1017
// MISSING LINE 1018
// MISSING LINE 1019
// MISSING LINE 1020
// MISSING LINE 1021
// MISSING LINE 1022
// MISSING LINE 1023
// MISSING LINE 1024
// MISSING LINE 1025
// MISSING LINE 1026
// MISSING LINE 1027
// MISSING LINE 1028
// MISSING LINE 1029
// MISSING LINE 1030
// MISSING LINE 1031
// MISSING LINE 1032
// MISSING LINE 1033
// MISSING LINE 1034
// MISSING LINE 1035
// MISSING LINE 1036
// MISSING LINE 1037
// MISSING LINE 1038
// MISSING LINE 1039
// MISSING LINE 1040
// MISSING LINE 1041
// MISSING LINE 1042
// MISSING LINE 1043
// MISSING LINE 1044
// MISSING LINE 1045
// MISSING LINE 1046
// MISSING LINE 1047
// MISSING LINE 1048
// MISSING LINE 1049
// MISSING LINE 1050
// MISSING LINE 1051
// MISSING LINE 1052
// MISSING LINE 1053
// MISSING LINE 1054
// MISSING LINE 1055
// MISSING LINE 1056
// MISSING LINE 1057
// MISSING LINE 1058
// MISSING LINE 1059
// MISSING LINE 1060
// MISSING LINE 1061
// MISSING LINE 1062
// MISSING LINE 1063
// MISSING LINE 1064
// MISSING LINE 1065
// MISSING LINE 1066
// MISSING LINE 1067
// MISSING LINE 1068
// MISSING LINE 1069
// MISSING LINE 1070
// MISSING LINE 1071
// MISSING LINE 1072
// MISSING LINE 1073
// MISSING LINE 1074
// MISSING LINE 1075
    }
  };

  // ---- Risk descriptions for common contaminants ----
  const contaminationRisks: Record<string, string[]> = {
    "lead": ["Lead poisoning (neurological damage)", "Cognitive impairment in children", "Developmental delays", "Kidney damage"],
    "mercury": ["Nerve damage", "Impaired vision/hearing", "Kidney toxicity"],
    "arsenic": ["Skin lesions", "Cancer risk (lung, bladder, skin)", "Cardiovascular effects"],
    "antimony": ["Stomach irritation", "Heart problems at high levels"],
    "cadmium": ["Kidney damage", "Bone demineralization"],
    "chromium": ["Allergic dermatitis", "Respiratory irritation", "Liver/kidney effects (high levels)"],
    "uranium": ["Kidney toxicity", "Increased cancer risk"],
    "barium": ["High blood pressure", "Heart rhythm changes"],
    "nitrate": ["Blue baby syndrome (methemoglobinemia)", "Reduced oxygen transport in blood"],
    "nitrite": ["Same as nitrate — oxygen transport interference"],
    "trihalomethanes": ["Increased cancer risk with long-term exposure", "Liver/kidney effects"],
    "haloacetic": ["Liver/kidney effects", "Potential cancer risk"],
    "chlorine": ["Irritation of eyes/nose/throat", "Aggravates asthma symptoms"],
    "copper": ["Stomach cramps / nausea", "Liver damage at very high levels"],
    "fluoride": ["Dental fluorosis (above safe levels)", "Skeletal fluorosis (rare, extreme levels)"],
    "hardness": ["Scale buildup in pipes/appliances", "Reduced soap effecti
// MISSING LINE 1097
// MISSING LINE 1098
// MISSING LINE 1099
// MISSING LINE 1100
// MISSING LINE 1101
// MISSING LINE 1102
// MISSING LINE 1103
// MISSING LINE 1104
// MISSING LINE 1105
// MISSING LINE 1106
// MISSING LINE 1107
// MISSING LINE 1108
// MISSING LINE 1109
// MISSING LINE 1110
// MISSING LINE 1111
// MISSING LINE 1112
// MISSING LINE 1113
// MISSING LINE 1114
// MISSING LINE 1115
// MISSING LINE 1116
// MISSING LINE 1117
// MISSING LINE 1118
// MISSING LINE 1119
// MISSING LINE 1120
// MISSING LINE 1121
// MISSING LINE 1122
// MISSING LINE 1123
// MISSING LINE 1124
// MISSING LINE 1125
// MISSING LINE 1126
// MISSING LINE 1127
// MISSING LINE 1128
// MISSING LINE 1129
// MISSING LINE 1130
// MISSING LINE 1131
// MISSING LINE 1132
// MISSING LINE 1133
// MISSING LINE 1134
// MISSING LINE 1135
// MISSING LINE 1136
// MISSING LINE 1137
// MISSING LINE 1138
// MISSING LINE 1139
// MISSING LINE 1140
// MISSING LINE 1141
// MISSING LINE 1142
// MISSING LINE 1143
// MISSING LINE 1144
// MISSING LINE 1145
// MISSING LINE 1146
// MISSING LINE 1147
// MISSING LINE 1148
// MISSING LINE 1149
// MISSING LINE 1150
// MISSING LINE 1151
// MISSING LINE 1152
// MISSING LINE 1153
// MISSING LINE 1154
// MISSING LINE 1155
// MISSING LINE 1156
// MISSING LINE 1157
// MISSING LINE 1158
// MISSING LINE 1159
// MISSING LINE 1160
// MISSING LINE 1161
// MISSING LINE 1162
// MISSING LINE 1163
// MISSING LINE 1164
// MISSING LINE 1165
// MISSING LINE 1166
// MISSING LINE 1167
// MISSING LINE 1168
// MISSING LINE 1169
// MISSING LINE 1170
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

          <div className="flex flex-wrap justify-center gap-1">
            {AVAILABLE_YEARS.map((year) => (
              Search
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-1">
            {AVAILABLE_YEARS.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => { setSelectedYear(year); if (selectedLocation) fetchWaterData(selectedLocation, year); }}
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
            {results.length === 0 ? (
              <div className="text-center py-10 text-gray-400">
                <p className="text-sm font-medium">No water systems found</p>
                <p className="text-xs mt-1">Try a different search term</p>
              </div>
            ) : (
              <>
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-1 mb-3">
                  {results.length} result{results.length > 1 ? 's' : ''} found
                </h3>
                {results.map((loc) => (
                  <div
                    key={loc.dws_id}
                    role="button"
                    tabIndex={0}
                    onClick={() => fetchWaterData(loc, selectedYear)}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fetchWaterData(loc, selectedYear); } }}
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
// MISSING LINE 1271
// MISSING LINE 1272
// MISSING LINE 1273
// MISSING LINE 1274
// MISSING LINE 1275
// MISSING LINE 1276
// MISSING LINE 1277
// MISSING LINE 1278
// MISSING LINE 1279
// MISSING LINE 1280
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
// MISSING LINE 1345
// MISSING LINE 1346
// MISSING LINE 1347
// MISSING LINE 1348
// MISSING LINE 1349
// MISSING LINE 1350
// MISSING LINE 1351
// MISSING LINE 1352
// MISSING LINE 1353
// MISSING LINE 1354
// MISSING LINE 1355
// MISSING LINE 1356
// MISSING LINE 1357
// MISSING LINE 1358
// MISSING LINE 1359
// MISSING LINE 1360
// MISSING LINE 1361
// MISSING LINE 1362
// MISSING LINE 1363
// MISSING LINE 1364
// MISSING LINE 1365
// MISSING LINE 1366
// MISSING LINE 1367
// MISSING LINE 1368
// MISSING LINE 1369
// MISSING LINE 1370
// MISSING LINE 1371
// MISSING LINE 1372
// MISSING LINE 1373
// MISSING LINE 1374
// MISSING LINE 1375
// MISSING LINE 1376
// MISSING LINE 1377
// MISSING LINE 1378
// MISSING LINE 1379
// MISSING LINE 1380
// MISSING LINE 1381
// MISSING LINE 1382
// MISSING LINE 1383
// MISSING LINE 1384
// MISSING LINE 1385
// MISSING LINE 1386
// MISSING LINE 1387
// MISSING LINE 1388
// MISSING LINE 1389
// MISSING LINE 1390
// MISSING LINE 1391
// MISSING LINE 1392
// MISSING LINE 1393
// MISSING LINE 1394
// MISSING LINE 1395
// MISSING LINE 1396
// MISSING LINE 1397
// MISSING LINE 1398
// MISSING LINE 1399
// MISSING LINE 1400
// MISSING LINE 1401
// MISSING LINE 1402
// MISSING LINE 1403
// MISSING LINE 1404
// MISSING LINE 1405
// MISSING LINE 1406
// MISSING LINE 1407
// MISSING LINE 1408
// MISSING LINE 1409
// MISSING LINE 1410
// MISSING LINE 1411
// MISSING LINE 1412
// MISSING LINE 1413
// MISSING LINE 1414
// MISSING LINE 1415
// MISSING LINE 1416
// MISSING LINE 1417
// MISSING LINE 1418
// MISSING LINE 1419
// MISSING LINE 1420
// MISSING LINE 1421
// MISSING LINE 1422
// MISSING LINE 1423
// MISSING LINE 1424
// MISSING LINE 1425
// MISSING LINE 1426
// MISSING LINE 1427
// MISSING LINE 1428
// MISSING LINE 1429
// MISSING LINE 1430
// MISSING LINE 1431
// MISSING LINE 1432
// MISSING LINE 1433
// MISSING LINE 1434
// MISSING LINE 1435
// MISSING LINE 1436
// MISSING LINE 1437
// MISSING LINE 1438
// MISSING LINE 1439
// MISSING LINE 1440
// MISSING LINE 1441
// MISSING LINE 1442
// MISSING LINE 1443
// MISSING LINE 1444
// MISSING LINE 1445
// MISSING LINE 1446
// MISSING LINE 1447
// MISSING LINE 1448
// MISSING LINE 1449
// MISSING LINE 1450
// MISSING LINE 1451
// MISSING LINE 1452
// MISSING LINE 1453
// MISSING LINE 1454
// MISSING LINE 1455
// MISSING LINE 1456
// MISSING LINE 1457
// MISSING LINE 1458
// MISSING LINE 1459
// MISSING LINE 1460
// MISSING LINE 1461
// MISSING LINE 1462
// MISSING LINE 1463
// MISSING LINE 1464
// MISSING LINE 1465
// MISSING LINE 1466
// MISSING LINE 1467
// MISSING LINE 1468
// MISSING LINE 1469
// MISSING LINE 1470
// MISSING LINE 1471
// MISSING LINE 1472
// MISSING LINE 1473
// MISSING LINE 1474
// MISSING LINE 1475
// MISSING LINE 1476
// MISSING LINE 1477
// MISSING LINE 1478
// MISSING LINE 1479
// MISSING LINE 1480
// MISSING LINE 1481
// MISSING LINE 1482
// MISSING LINE 1483
// MISSING LINE 1484
// MISSING LINE 1485
// MISSING LINE 1486
// MISSING LINE 1487
// MISSING LINE 1488
// MISSING LINE 1489
// MISSING LINE 1490
// MISSING LINE 1491
// MISSING LINE 1492
// MISSING LINE 1493
// MISSING LINE 1494
// MISSING LINE 1495
// MISSING LINE 1496
// MISSING LINE 1497
// MISSING LINE 1498
// MISSING LINE 1499
// MISSING LINE 1500
// MISSING LINE 1501
// MISSING LINE 1502
// MISSING LINE 1503
// MISSING LINE 1504
// MISSING LINE 1505
// MISSING LINE 1506
// MISSING LINE 1507
// MISSING LINE 1508
// MISSING LINE 1509
// MISSING LINE 1510
// MISSING LINE 1511
// MISSING LINE 1512
// MISSING LINE 1513
// MISSING LINE 1514
// MISSING LINE 1515
// MISSING LINE 1516
// MISSING LINE 1517
// MISSING LINE 1518
// MISSING LINE 1519
// MISSING LINE 1520
// MISSING LINE 1521
// MISSING LINE 1522
// MISSING LINE 1523
// MISSING LINE 1524
// MISSING LINE 1525
// MISSING LINE 1526
// MISSING LINE 1527
// MISSING LINE 1528
// MISSING LINE 1529
// MISSING LINE 1530
// MISSING LINE 1531
// MISSING LINE 1532
// MISSING LINE 1533
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

// MISSING LINE 1561
// MISSING LINE 1562
// MISSING LINE 1563
// MISSING LINE 1564

                      const microbeConfig = getSafetyBarConfig(waterTests, 'microbe');
                      const chemicalConfig = getSafetyBarConfig(waterTests, 'chemical');
                      const additiveConfig = getAdditiveStatus(additives);
                      const hardnessInfo = getHardnessInfo(waterTests, selectedLocation.dwsp_data);

                      return (
                        <>
                          {/* At-a-Glance Summary Card Section */}
                          <div className="space-y-2.5 sm:space-y-3">
                            <h3 className="text-sm sm:text-lg font-bold text-gray-950">Summary</h3>
                            <div className="border border-gray-200 bg-gray-50/5 rounded-2xl p-3 sm:p-6 shadow-sm">
                              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
                                {/* Column 1: Bacteria & Microbes */}
                                <div className="flex flex-col space-y-2 sm:space-y-3 pb-4 lg:pb-0 lg:pr-6">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 border border-green-100 shadow-sm">
                                      <Microscope className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                     
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
                                <div className="flex flex-col space-y-2 sm:space-y-3 pt-4 lg:pt-0 lg:px-6">
                                  <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                                      <FlaskConical className="w-4.5 h-4.5 sm:w-6 sm:h-6" />
                                    </div>
                                    <div>
                                      <h4 className="text-xs sm:text-base font-bold text-gray-900 leading-tight">Heavy Metals & Pollutants</h4>
                                      <span className={cn(
                                        "text-[10px] sm:text-xs font-bold uppercase",
                   
// MISSING LINE 1619
// MISSING LINE 1620
// MISSING LINE 1621
// MISSING LINE 1622
// MISSING LINE 1623
// MISSING LINE 1624
// MISSING LINE 1625
// MISSING LINE 1626
// MISSING LINE 1627
// MISSING LINE 1628
// MISSING LINE 1629
// MISSING LINE 1630
// MISSING LINE 1631
// MISSING LINE 1632
// MISSING LINE 1633
// MISSING LINE 1634
// MISSING LINE 1635
// MISSING LINE 1636
// MISSING LINE 1637
// MISSING LINE 1638
// MISSING LINE 1639
// MISSING LINE 1640
// MISSING LINE 1641
// MISSING LINE 1642
// MISSING LINE 1643
// MISSING LINE 1644
// MISSING LINE 1645
// MISSING LINE 1646
// MISSING LINE 1647
// MISSING LINE 1648
// MISSING LINE 1649
// MISSING LINE 1650
// MISSING LINE 1651
// MISSING LINE 1652
// MISSING LINE 1653
// MISSING LINE 1654
// MISSING LINE 1655
// MISSING LINE 1656
// MISSING LINE 1657
// MISSING LINE 1658
// MISSING LINE 1659
// MISSING LINE 1660
// MISSING LINE 1661
// MISSING LINE 1662
// MISSING LINE 1663
// MISSING LINE 1664
// MISSING LINE 1665
// MISSING LINE 1666
// MISSING LINE 1667
// MISSING LINE 1668
// MISSING LINE 1669
// MISSING LINE 1670
// MISSING LINE 1671
// MISSING LINE 1672
// MISSING LINE 1673
// MISSING LINE 1674
// MISSING LINE 1675
// MISSING LINE 1676
// MISSING LINE 1677
// MISSING LINE 1678
// MISSING LINE 1679
// MISSING LINE 1680
// MISSING LINE 1681
// MISSING LINE 1682
// MISSING LINE 1683
// MISSING LINE 1684
// MISSING LINE 1685
// MISSING LINE 1686
// MISSING LINE 1687
// MISSING LINE 1688
// MISSING LINE 1689
// MISSING LINE 1690
// MISSING LINE 1691
// MISSING LINE 1692
// MISSING LINE 1693
// MISSING LINE 1694
// MISSING LINE 1695
// MISSING LINE 1696
// MISSING LINE 1697
// MISSING LINE 1698
// MISSING LINE 1699
// MISSING LINE 1700
// MISSING LINE 1701
// MISSING LINE 1702
// MISSING LINE 1703
// MISSING LINE 1704
// MISSING LINE 1705
// MISSING LINE 1706
// MISSING LINE 1707
// MISSING LINE 1708
// MISSING LINE 1709
// MISSING LINE 1710
// MISSING LINE 1711
// MISSING LINE 1712
// MISSING LINE 1713
// MISSING LINE 1714
// MISSING LINE 1715
                                    className="pointer-events-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-lg transition-all cursor-pointer transform translate-y-3"
                                  >
                                    Show All Parameters ({sortedWaterTests.length}) <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Show Less option below the list */}
                            {showAllParameters && sortedWaterTests.length > 6 && (
                              <div className="flex justify-center pt-2">
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
// MISSING LINE 1751
// MISSING LINE 1752
// MISSING LINE 1753
// MISSING LINE 1754
// MISSING LINE 1755
// MISSING LINE 1756
// MISSING LINE 1757
// MISSING LINE 1758
// MISSING LINE 1759
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
                                               
// MISSING LINE 1775
// MISSING LINE 1776
// MISSING LINE 1777
// MISSING LINE 1778
// MISSING LINE 1779
// MISSING LINE 1780
// MISSING LINE 1781
// MISSING LINE 1782
// MISSING LINE 1783
// MISSING LINE 1784
// MISSING LINE 1785
// MISSING LINE 1786
// MISSING LINE 1787
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
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">All Samples</span>
                                                    <span className="text-[8px] sm:text-[10px] text-gray-400">{test.sampleCount} measurements</span>
                                                  </div>

                                                  {rawSamplesLoading[rowKey] ? (
                                                    <div className="flex items-center justify-center gap-1 py-2 text-gray-400 text-[8px] sm:text-[10px] bg-white rounded-md sm:rounded-lg border border-gray-100">
                                                      <Loader2 className="w-3 sm:w-3.5 h-3 sm:h-3.5 animate-spin text-blue-500" />
                                                      Loading sample records...
                                                    </div>
                                                  ) : rawSamplesData[rowKey] && rawSamplesData[rowKey].length > 0 ? (
                                                    <div className="space-y-1 sm:space-y-1.5 max-h-36 sm:max-h-48 overflow-y-auto pr-1">
                                                      {rawSamplesData[rowKey].map((sample: any, sIdx: number) => {
                                                        const sampleLimitInfo = getOntarioLimitInfo(sa
// MISSING LINE 1814
// MISSING LINE 1815
// MISSING LINE 1816
// MISSING LINE 1817
// MISSING LINE 1818
                                                                {sample.result_value !== null ? `${sample.result_value} ${formatUnitForDisplay(sample.result_unit)}` : (sample.exceedance === 'Y' ? 'Present' : '0')}
                                                              </span>
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
                                                  ) : (
                                                    <div className="text-center text-[8px] sm:text-[10px] text-gray-400 py-2 bg-white rounded-md sm:rounded-lg border border-gray-100">
                                                      No sample history available.
                                                    </div>
                                                  )}
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
                                                </div>
                                              </div>

                                              {/* Lazy-loaded history list inside the card */}
                                              {isExpandable && (
                                                <div className="space-y-1.5 pt-1">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-[8px] sm:text-[10px] uppercase font-bold text-gray-400 tracking-wider">All Samples</span>
                                                    <span className="text-[8px] sm:text-[10px] text-gray-400">{test.sampleCount} measurements</span>
                                                  </div>

                                                  {rawSamplesLoading[
// MISSING LINE 1862
// MISSING LINE 1863
// MISSING LINE 1864
// MISSING LINE 1865
// MISSING LINE 1866
// MISSING LINE 1867
// MISSING LINE 1868
// MISSING LINE 1869
// MISSING LINE 1870
// MISSING LINE 1871
// MISSING LINE 1872
// MISSING LINE 1873
// MISSING LINE 1874
// MISSING LINE 1875
// MISSING LINE 1876
// MISSING LINE 1877
// MISSING LINE 1878
// MISSING LINE 1879
// MISSING LINE 1880
// MISSING LINE 1881
// MISSING LINE 1882
// MISSING LINE 1883
// MISSING LINE 1884
// MISSING LINE 1885
// MISSING LINE 1886
// MISSING LINE 1887
// MISSING LINE 1888
                                                      No sample history available.
                                                    </div>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </motion.div>
                                        )}
                                      </AnimatePresence>
                                    </div>
                                  );
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-4">
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
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-s
// MISSING LINE 1918
// MISSING LINE 1919
// MISSING LINE 1920
// MISSING LINE 1921
// MISSING LINE 1922
// MISSING LINE 1923
                                    {exceedances.length > 0
                                      ? "Active carbon or specialized heavy-metal filtration is recommended for this location."
                                      : "While safe, an optional charcoal filter can improve taste."}
                                  </p>
                                </div>
                              </div>

                              {/* Updates Card */}
                              <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-5 flex items-start gap-2.5 sm:gap-3 shadow-inner">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-amber-50 flex items-center justify-center shrink-0 shadow-sm">
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
                      );
                    })()}
                  </div>
                )
              ) : (
// MISSING LINE 1951
// MISSING LINE 1952
// MISSING LINE 1953
// MISSING LINE 1954
// MISSING LINE 1955
// MISSING LINE 1956
// MISSING LINE 1957
// MISSING LINE 1958
// MISSING LINE 1959
// MISSING LINE 1960
// MISSING LINE 1961
// MISSING LINE 1962
// MISSING LINE 1963
// MISSING LINE 1964
// MISSING LINE 1965
// MISSING LINE 1966
// MISSING LINE 1967
// MISSING LINE 1968
// MISSING LINE 1969
// MISSING LINE 1970
// MISSING LINE 1971
// MISSING LINE 1972
// MISSING LINE 1973
// MISSING LINE 1974
// MISSING LINE 1975
// MISSING LINE 1976
// MISSING LINE 1977
// MISSING LINE 1978
// MISSING LINE 1979
// MISSING LINE 1980
// MISSING LINE 1981
// MISSING LINE 1982
// MISSING LINE 1983
// MISSING LINE 1984
// MISSING LINE 1985
// MISSING LINE 1986
// MISSING LINE 1987
// MISSING LINE 1988
// MISSING LINE 1989
// MISSING LINE 1990
// MISSING LINE 1991
// MISSING LINE 1992
// MISSING LINE 1993
// MISSING LINE 1994
// MISSING LINE 1995
// MISSING LINE 1996
// MISSING LINE 1997
// MISSING LINE 1998
// MISSING LINE 1999
// MISSING LINE 2000
// MISSING LINE 2001
// MISSING LINE 2002
// MISSING LINE 2003
// MISSING LINE 2004
// MISSING LINE 2005
// MISSING LINE 2006
// MISSING LINE 2007
// MISSING LINE 2008
// MISSING LINE 2009
// MISSING LINE 2010
// MISSING LINE 2011
// MISSING LINE 2012
// MISSING LINE 2013
// MISSING LINE 2014
// MISSING LINE 2015
// MISSING LINE 2016
// MISSING LINE 2017
// MISSING LINE 2018
// MISSING LINE 2019
// MISSING LINE 2020
// MISSING LINE 2021
// MISSING LINE 2022
// MISSING LINE 2023
// MISSING LINE 2024
// MISSING LINE 2025
// MISSING LINE 2026
// MISSING LINE 2027
// MISSING LINE 2028
// MISSING LINE 2029
// MISSING LINE 2030
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
                              {detectedParams.length}
                            </span>
                          </h4>
                          {exceedances.length > 0 ? (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                              <p className="text-[11px] sm:text-xs text-red-850 leading-relaxed font-semibold">
                                <strong>High Risk:</strong> The contaminants below exceed standard drinking water thresholds. Make sure your chosen filtration system is certified to remove these specific compounds.
                              </p>
                            </div>
                          ) : (
                            <div className="p-3 bg-yellow-50/50 border border-yellow-100 rounded-lg flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <p className="text-[11px] sm:text-xs text-amber-800 leading-relaxed font-medium">
                                <strong>Trace Contaminants Detected:</strong> No parameters exceeded health guidelines, but trace amounts are present. You can review their impacts and choose a filter type below.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Grid of contaminant cards (1 column list on mobile, 3/4 columns of squares on desktop) */}
                        <div className="relative">
                          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3">
                            {detectedParams.length === 0 ? (
                              <div className="col-span-full py-4 text-center text-xs text-gray-400 font-medium">
                                No contaminants detected in trace or exceeded amounts.
                              </div>
                            ) : (
                              (showAllContaminants ? detectedParams : detectedParams.slice(0, isMobile ? 4 : 8)).map((param, pIdx) => {
                                const limitInfo = getOntarioLimitInfo(param.contaminant, param.level, param.unit, param.exceedanceCount || 0, param.parameterLimit);
// MISSING LINE 2096
// MISSING LINE 2097
// MISSING LINE 2098
// MISSING LINE 2099
// MISSING LINE 2100
// MISSING LINE 2101
// MISSING LINE 2102
// MISSING LINE 2103
// MISSING LINE 2104
// MISSING LINE 2105
// MISSING LINE 2106
// MISSING LINE 2107
// MISSING LINE 2108
// MISSING LINE 2109
// MISSING LINE 2110
// MISSING LINE 2111
// MISSING LINE 2112
// MISSING LINE 2113
// MISSING LINE 2114
// MISSING LINE 2115
// MISSING LINE 2116
// MISSING LINE 2117
// MISSING LINE 2118
// MISSING LINE 2119
// MISSING LINE 2120
// MISSING LINE 2121
// MISSING LINE 2122
// MISSING LINE 2123
// MISSING LINE 2124
// MISSING LINE 2125
// MISSING LINE 2126
// MISSING LINE 2127
// MISSING LINE 2128
// MISSING LINE 2129
// MISSING LINE 2130
// MISSING LINE 2131
// MISSING LINE 2132
// MISSING LINE 2133
// MISSING LINE 2134
// MISSING LINE 2135
// MISSING LINE 2136
// MISSING LINE 2137
                      
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
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">{b.label}</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                                  ) : (
                                    <>Show All ({detectedParams.length}) <ChevronDown className="w-3.5 h-3.5" /></>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>


                      {/* Cross-link to Filter Guide */}
                      <div className="pt-3 px-1 text-center sm:text-left">
                        <p className="text-xs sm:text-sm text-gray-500 font-medium">
                          Learn more about how these systems work in our <a href="/filters" className="text-blue-600 font-semibold hover:text-blue-800 underline">Filter Guide</a>.
                        </p>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* Return to Results (bottom) */}
            <div className="text-center pt-2">
              <button
                onClick={() => { setSelectedLocation(null); setDetailTab('quality'); }}
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
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 text-blue-200">
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
// MISSING LINE 2238
// MISSING LINE 2239
// MISSING LINE 2240
// MISSING LINE 2241
// MISSING LINE 2242
// MISSING LINE 2243
// MISSING LINE 2244
// MISSING LINE 2245
// MISSING LINE 2246
// MISSING LINE 2247
// MISSING LINE 2248
// MISSING LINE 2249
// MISSING LINE 2250
// MISSING LINE 2251
// MISSING LINE 2252
// MISSING LINE 2253
// MISSING LINE 2254
// MISSING LINE 2255
// MISSING LINE 2256
// MISSING LINE 2257
// MISSING LINE 2258
// MISSING LINE 2259
// MISSING LINE 2260
// MISSING LINE 2261
// MISSING LINE 2262
// MISSING LINE 2263
// MISSING LINE 2264
// MISSING LINE 2265
// MISSING LINE 2266
// MISSING LINE 2267
// MISSING LINE 2268
// MISSING LINE 2269
// MISSING LINE 2270
// MISSING LINE 2271
// MISSING LINE 2272
// MISSING LINE 2273
// MISSING LINE 2274
// MISSING LINE 2275
// MISSING LINE 2276
// MISSING LINE 2277
// MISSING LINE 2278
// MISSING LINE 2279
// MISSING LINE 2280
// MISSING LINE 2281
// MISSING LINE 2282
// MISSING LINE 2283
// MISSING LINE 2284
// MISSING LINE 2285
// MISSING LINE 2286
// MISSING LINE 2287
// MISSING LINE 2288
// MISSING LINE 2289
// MISSING LINE 2290
// MISSING LINE 2291
// MISSING LINE 2292
// MISSING LINE 2293
// MISSING LINE 2294
// MISSING LINE 2295
// MISSING LINE 2296
// MISSING LINE 2297
// MISSING LINE 2298
// MISSING LINE 2299
// MISSING LINE 2300
// MISSING LINE 2301
// MISSING LINE 2302
// MISSING LINE 2303
// MISSING LINE 2304
// MISSING LINE 2305
// MISSING LINE 2306
// MISSING LINE 2307
// MISSING LINE 2308
// MISSING LINE 2309
// MISSING LINE 2310
// MISSING LINE 2311
// MISSING LINE 2312
// MISSING LINE 2313
// MISSING LINE 2314
// MISSING LINE 2315
// MISSING LINE 2316
// MISSING LINE 2317
// MISSING LINE 2318
// MISSING LINE 2319
// MISSING LINE 2320
// MISSING LINE 2321
// MISSING LINE 2322
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
                                  <span className="font-extrabold text-slate-800 text-[10px] sm:text-xs">{b.label}</span>
                                </div>
                                <p className="text-[9px] sm:text-[11px] text-slate-500 font-semibold leading-relaxed pl-6.5">
                                  {b.description}
                                </p>
                              </div>
                            ))}
                          </div>

                          <div className="flex items-center justify-end text-[8px] sm:text-[10px] text-gray-400 font-bold pt-2 border-t border-slate-100/50">
                            <span>System Average: {hardness > 0 ? `${hardness.toFixed(0)} mg/L` : "Not Tracked"}</span>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Card 2: Iron */}
// MISSING LINE 2351
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
// MISSING LINE 2376
// MISSING LINE 2377
// MISSING LINE 2378
// MISSING LINE 2379
// MISSING LINE 2380
// MISSING LINE 2381
// MISSING LINE 2382
// MISSING LINE 2383
// MISSING LINE 2384
// MISSING LINE 2385
// MISSING LINE 2386
// MISSING LINE 2387
// MISSING LINE 2388
// MISSING LINE 2389
// MISSING LINE 2390
// MISSING LINE 2391
// MISSING LINE 2392
// MISSING LINE 2393
// MISSING LINE 2394
// MISSING LINE 2395
// MISSING LINE 2396
// MISSING LINE 2397
// MISSING LINE 2398
// MISSING LINE 2399
// MISSING LINE 2400
// MISSING LINE 2401
// MISSING LINE 2402
// MISSING LINE 2403
// MISSING LINE 2404
// MISSING LINE 2405
// MISSING LINE 2406
// MISSING LINE 2407
// MISSING LINE 2408
// MISSING LINE 2409
// MISSING LINE 2410
// MISSING LINE 2411
// MISSING LINE 2412
// MISSING LINE 2413
// MISSING LINE 2414
// MISSING LINE 2415
// MISSING LINE 2416
// MISSING LINE 2417
// MISSING LINE 2418
// MISSING LINE 2419
// MISSING LINE 2420
// MISSING LINE 2421
// MISSING LINE 2422
// MISSING LINE 2423
// MISSING LINE 2424
// MISSING LINE 2425
// MISSING LINE 2426
// MISSING LINE 2427
// MISSING LINE 2428
// MISSING LINE 2429
// MISSING LINE 2430
// MISSING LINE 2431
// MISSING LINE 2432
// MISSING LINE 2433
// MISSING LINE 2434
// MISSING LINE 2435
// MISSING LINE 2436
// MISSING LINE 2437
// MISSING LINE 2438
// MISSING LINE 2439
// MISSING LINE 2440
// MISSING LINE 2441
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
// MISSING LINE 2479
// MISSING LINE 2480
// MISSING LINE 2481
// MISSING LINE 2482
// MISSING LINE 2483
// MISSING LINE 2484
// MISSING LINE 2485
// MISSING LINE 2486
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
