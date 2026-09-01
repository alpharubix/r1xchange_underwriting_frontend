import himalayaLogo from "@/assets/himalaya_logo.png";
import cavinkareLogo from "@/assets/cavinkare_logo.png";

export interface BrandInfo {
  logo: string | null;
  name: string;
  initial: string;
}

export function getAnchorBrand(user: any): BrandInfo {
  const code = String(
    user?.anchor_code ||
    user?.anchorCode ||
    user?.anchor_id ||
    ""
  ).toLowerCase().trim();

  const combined = [
    user?.anchor_code,
    user?.anchorCode,
    user?.anchor_name,
    user?.anchorName,
    user?.company_name,
    user?.companyName,
    user?.customer_name,
    user?.customerName,
    user?.name,
    user?.login_id,
    user?.loginid,
    user?.email_id,
    user?.email,
    user?.anchor_id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const rawName =
    user?.name ||
    user?.anchor_name ||
    user?.company_name ||
    user?.customer_name ||
    user?.login_id ||
    "User";

  const getInitials = (name?: string): string => {
    if (!name) return "U";
    const clean = name.trim();
    const parts = clean.split(/[\s_\-]+/).filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    if (parts.length === 1) {
      const single = parts[0];
      const upperMatches = single.match(/[A-Z]/g);
      if (upperMatches && upperMatches.length >= 2) {
        return (upperMatches[0] + upperMatches[1]).toUpperCase();
      }
      return single.slice(0, 2).toUpperCase();
    }
    return clean.slice(0, 2).toUpperCase();
  };

  // Check for CavinKare (cavin, cavinkare, cavin kare, or code ck, ck01, etc.)
  if (
    combined.includes("cavin") ||
    combined.includes("kare") ||
    code === "ck" ||
    code.startsWith("ck") ||
    code.includes("cavin")
  ) {
    return {
      logo: cavinkareLogo,
      name: rawName,
      initial: "CK",
    };
  }

  // Check for Himalaya (himalaya, hwc, hw, hml, or code hwc, hwc01, etc.)
  if (
    combined.includes("himalaya") ||
    combined.includes("hwc") ||
    code === "hwc" ||
    code.startsWith("hw") ||
    code.includes("himalaya")
  ) {
    return {
      logo: himalayaLogo,
      name: rawName,
      initial: "H",
    };
  }

  // Other anchor fallback (e.g. Test_Enterprises -> TE, etc.)
  return {
    logo: null,
    name: rawName,
    initial: getInitials(rawName),
  };
}
