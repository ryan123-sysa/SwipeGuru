import { execSync } from "child_process";

try {
  console.log("Listing all Node/Express processes...");
  const psOutput = execSync("ps aux | grep -i node").toString();
  console.log(psOutput);

  console.log("\nChecking network sockets on port 3000...");
  try {
    const netstatOutput = execSync("ss -lntp | grep 3000 || netstat -antp | grep 3000 || lsof -i :3000").toString();
    console.log(netstatOutput);
  } catch (e: any) {
    console.log("No netstat/ss/lsof output or port 3000 not found:", e.message);
  }
} catch (err: any) {
  console.error("Shell process error:", err.message);
}
