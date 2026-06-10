import { execSync } from "child_process";

try {
  console.log("Locating process on port 3000...");
  const output = execSync("lsof -t -i:3000 || ss -lntp | grep 3000").toString();
  console.log("Raw output:", output);
  
  // Extract PIDs
  const pids = output.match(/\d+/g);
  if (pids) {
    const uniquePids = Array.from(new Set(pids.map(Number)));
    console.log("PIDs to kill:", uniquePids);
    for (const pid of uniquePids) {
      if (pid === process.pid) continue; // Don't kill ourselves
      try {
        process.kill(pid, "SIGKILL");
        console.log(`Successfully SIGKILL'd PID ${pid}`);
      } catch (killErr: any) {
        console.log(`Failed to kill PID ${pid}:`, killErr.message);
      }
    }
  } else {
    // Failback: kill 3235 explicitly
    console.log("No dynamic PIDs found, trying explicit 3235...");
    try {
      process.kill(3235, "SIGKILL");
      console.log("Successfully SIGKILL'd PID 3235");
    } catch (e: any) {
      console.log("Explicit kill failed:", e.message);
    }
  }
} catch (err: any) {
  console.error("Error executing custom kill:", err.message);
  // Fallback direct kill 3235
  try {
    process.kill(3235, "SIGKILL");
    console.log("Fallback direct kill successful");
  } catch (e: any) {
    console.log("Fallback direct kill failed:", e.message);
  }
}
