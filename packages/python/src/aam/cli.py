import os
import sys
import subprocess
import shutil

def run():
    # 1. Verify Node.js is installed
    node_bin = shutil.which("node")
    if not node_bin:
        print("\n❌ Error: Node.js runtime not found on your system path.", file=sys.stderr)
        print("Architecture-As-Memory (AAM) requires Node.js (version 18 or above) to run.", file=sys.stderr)
        print("Please install Node.js from https://nodejs.org/ and try again.\n", file=sys.stderr)
        sys.exit(1)

    # 2. Locate our bundled JS CLI script
    base_dir = os.path.dirname(os.path.abspath(__file__))
    js_entrypoint = os.path.join(base_dir, "js", "bin", "aam.js")

    if not os.path.exists(js_entrypoint):
        print(f"\n❌ Error: AAM core JavaScript module could not be located at:\n  {js_entrypoint}", file=sys.stderr)
        print("Please build or reinstall the package properly.\n", file=sys.stderr)
        sys.exit(1)

    # 3. Invoke Node.js with the JS entrypoint and all forwarded arguments
    cmd = [node_bin, js_entrypoint] + sys.argv[1:]
    
    try:
        result = subprocess.run(cmd)
        sys.exit(result.returncode)
    except KeyboardInterrupt:
        # Exit gracefully on Ctrl+C
        sys.exit(0)
    except Exception as e:
        print(f"\n❌ Error: Failed to execute AAM core process: {e}", file=sys.stderr)
        sys.exit(1)
