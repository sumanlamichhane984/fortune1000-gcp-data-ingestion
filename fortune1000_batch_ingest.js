function process(input) {
  try {
    if (input === null || input === undefined) return null;

    var s = String(input).trim();
    if (s.length === 0) return null;

    function isEmpty(v) {
      if (v === undefined || v === null) return true;
      var t = String(v).trim().toLowerCase();
      return t === "" || t === "na" || t === "n/a" || t === "null" || t === "none";
    }
    function getStringVal(v) { return isEmpty(v) ? null : String(v).trim(); }
    function normalizeNumber(v) {
      if (isEmpty(v)) return null;
      return String(v).replace(/[$,%]/g, "").replace(/,/g, "").trim();
    }
    function toIntVal(v) {
      var x = normalizeNumber(v);
      if (x === null) return null;
      var n = Number(x);
      return isFinite(n) ? Math.trunc(n) : null;
    }
    function toFloatVal(v) {
      var x = normalizeNumber(v);
      if (x === null) return null;
      var n = Number(x);
      return isFinite(n) ? n : null;
    }
    function toDateVal(v) {
      if (isEmpty(v)) return null;
      var t = String(v).trim();
      if (t.length >= 10) t = t.slice(0, 10);
      return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null;
    }

    var obj;

    // If JSON
    if (s[0] === "{") {
      obj = JSON.parse(s);
    } else {
      // CSV line
      if (s.startsWith("Rank,Company,")) return null;

      function parseCsvRow(row) {
        var out = [];
        var cur = "";
        var inQuotes = false;

        for (var i = 0; i < row.length; i++) {
          var ch = row[i];
          if (ch === '"') {
            if (inQuotes && i + 1 < row.length && row[i + 1] === '"') { cur += '"'; i++; }
            else { inQuotes = !inQuotes; }
          } else if (ch === "," && !inQuotes) {
            out.push(cur); cur = "";
          } else cur += ch;
        }
        out.push(cur);
        return out;
      }

      var cols = [
        "Rank","Company","Ticker","Sector","Industry","Profitable","Founder_is_CEO","FemaleCEO",
        "Growth_in_Jobs","Change_in_Rank","Gained_in_Rank","Dropped_in_Rank",
        "Newcomer_to_the_Fortune500","Global500","Worlds_Most_Admired_Companies",
        "Best_Companies_to_Work_For","Number_of_employees","MarketCap_March28_M",
        "Revenues_M","RevenuePercentChange","Profits_M","ProfitsPercentChange",
        "Assets_M","CEO","Country","HeadquartersCity","HeadquartersState","Website",
        "CompanyType","Footnote","MarketCap_Updated_M","Updated"
      ];

      var vals = parseCsvRow(s);
      while (vals.length < cols.length) vals.push("");

      obj = {};
      for (var c = 0; c < cols.length; c++) obj[cols[c]] = String(vals[c] || "").trim();
    }

    var out = {
      Rank: toIntVal(obj["Rank"]),
      Company: getStringVal(obj["Company"]),
      Ticker: getStringVal(obj["Ticker"]),
      Sector: getStringVal(obj["Sector"]),
      Industry: getStringVal(obj["Industry"]),
      Profitable: getStringVal(obj["Profitable"]),
      Founder_is_CEO: getStringVal(obj["Founder_is_CEO"]),
      FemaleCEO: getStringVal(obj["FemaleCEO"]),
      Growth_in_Jobs: getStringVal(obj["Growth_in_Jobs"]),
      Change_in_Rank: toFloatVal(obj["Change_in_Rank"]),
      Gained_in_Rank: getStringVal(obj["Gained_in_Rank"]),
      Dropped_in_Rank: getStringVal(obj["Dropped_in_Rank"]),
      Newcomer_to_the_Fortune500: getStringVal(obj["Newcomer_to_the_Fortune500"]),
      Global500: getStringVal(obj["Global500"]),
      Worlds_Most_Admired_Companies: getStringVal(obj["Worlds_Most_Admired_Companies"]),
      Best_Companies_to_Work_For: getStringVal(obj["Best_Companies_to_Work_For"]),
      Number_of_employees: toIntVal(obj["Number_of_employees"]),
      MarketCap_March28_M: toFloatVal(obj["MarketCap_March28_M"]),
      Revenues_M: toFloatVal(obj["Revenues_M"]),
      RevenuePercentChange: toFloatVal(obj["RevenuePercentChange"]),
      Profits_M: toFloatVal(obj["Profits_M"]),
      ProfitsPercentChange: toFloatVal(obj["ProfitsPercentChange"]),
      Assets_M: toFloatVal(obj["Assets_M"]),
      CEO: getStringVal(obj["CEO"]),
      Country: getStringVal(obj["Country"]),
      HeadquartersCity: getStringVal(obj["HeadquartersCity"]),
      HeadquartersState: getStringVal(obj["HeadquartersState"]),
      Website: getStringVal(obj["Website"]),
      CompanyType: getStringVal(obj["CompanyType"]),
      Footnote: getStringVal(obj["Footnote"]),
      MarketCap_Updated_M: toFloatVal(obj["MarketCap_Updated_M"]),
      Updated: toDateVal(obj["Updated"])
    };

    return JSON.stringify(out);
  } catch (e) {
    return null;
  }
}
