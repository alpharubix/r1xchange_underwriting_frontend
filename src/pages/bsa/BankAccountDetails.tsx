import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Tile from "@/components/ui/Tile";

function BankAccountDetails() {
  const stored = sessionStorage.getItem("account_details");
  const accountDetails = stored ? JSON.parse(stored) : null;

  if (!accountDetails) return null;

  const entries = Object.entries(accountDetails);

  const normalTiles = entries.filter(
    ([key]) => key !== "Opening Balance" && key !== "Closing Balance"
  );

  const openingBalance = entries.find(
    ([key]) => key === "Opening Balance"
  );

  const closingBalance = entries.find(
    ([key]) => key === "Closing Balance"
  );

  return (
    <Card className="mx-auto shadow-sm border border-gray-300">
      <CardHeader>
        <CardTitle className="text-xl text-[#000080]/60">
          Account Details
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* First 8 tiles */}
        <div className="grid grid-cols-4 gap-4">
          {normalTiles.map(([key, value]) => (
            <Tile
              key={key}
              title={key}
              value={String(value)}
            />
          ))}
        </div>

        {/* Third row */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {openingBalance && (
            <Tile
              className="col-span-2"
              title={openingBalance[0]} 
              value={String(openingBalance[1])}
            />
          )}

          {closingBalance && (
            <Tile
              className="col-span-2"
              title={closingBalance[0]}
              value={String(closingBalance[1])}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default BankAccountDetails;