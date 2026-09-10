import os
import glob

src_dir = r"c:\Online_Auction_Platform\Auction-Frontend-main\my-app\src"
files = glob.glob(src_dir + "/**/*.js", recursive=True) + glob.glob(src_dir + "/**/*.jsx", recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "http://localhost:8080" in content:
        # If it's a service file, update API_BASE
        if file.endswith("authService.js") or file.endswith("adminService.js") or file.endswith("auctionService.js"):
            content = content.replace('const API_BASE = "http://localhost:8080";', 'const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8080";')
        else:
            # For components, add import if not exists, and replace
            if "import { API_BASE " not in content and "API_BASE" not in content:
                # determine relative path to config/apiConfig
                rel_path_levels = file[len(src_dir):].count(os.sep) - 1
                rel_prefix = "../" * rel_path_levels if rel_path_levels > 0 else "./"
                import_stmt = f"import {{ API_BASE, WS_BASE }} from '{rel_prefix}config/apiConfig';\n"
                
                # insert import after last import
                lines = content.splitlines()
                last_import_idx = 0
                for i, line in enumerate(lines):
                    if line.startswith("import "):
                        last_import_idx = i
                
                lines.insert(last_import_idx + 1, import_stmt)
                content = "\n".join(lines)
            
            content = content.replace('http://localhost:8080/ws', '${WS_BASE}')
            content = content.replace('http://localhost:8080', '${API_BASE}')
            # Fix backticks where single quotes were used
            content = content.replace("fetch('${API_BASE}/auctions')", "fetch(`${API_BASE}/auctions`)")
            content = content.replace("fetch('${API_BASE}/auctions/recent')", "fetch(`${API_BASE}/auctions/recent`)")
            content = content.replace("SockJS('${WS_BASE}')", "SockJS(`${WS_BASE}`)")
            content = content.replace("fetch('${API_BASE}/bids',", "fetch(`${API_BASE}/bids`,")
            
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
