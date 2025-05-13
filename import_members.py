import json
import pandas as pd
import os
import sys
from openpyxl import load_workbook
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles import Alignment, Font

def extract_member_data(file_path):
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        # Get current guild data
        current_guild = data.get("guild", {})
        guild_name = current_guild.get("name", "")
        print(f"Processing guild: {guild_name}")
        
        # Get current raid participants
        raids = current_guild.get("scheduled_raids", [])
        current_participants = set()
        
        for raid in raids:
            if raid.get("status") == "IN_PROGRESS":
                participants = raid.get("raid", {}).get("participants", [])
                current_participants.update(p.get("name") for p in participants)
                print(f"Found {len(participants)} participants in current raid")

        # Create a dictionary to store DataFrames for each guild
        guild_dfs = {}
        
        # Process current guild
        members = current_guild.get("members", [])
        member_data = []
        
        for member in members:
            # Extract badges which contain level information
            badges = member.get("badges", [])
            
            # Extract and convert levels to integers
            total_level = next((int(badge.split("Total Lv. ")[1]) for badge in badges if "Total Lv." in badge), 0)
            combat_level = next((int(badge.split("Combat Lv. ")[1]) for badge in badges if "Combat Lv." in badge), 0)
            
            # Check if member is in current raid
            status = "OK" if member.get("name") in current_participants else "X"
            
            member_data.append({
                "Name": member.get("name", "Unknown"),
                "Total Level": total_level,
                "Combat Level": combat_level,
                "Status": status
            })
        
        # Create DataFrame for this guild
        df = pd.DataFrame(member_data)
        guild_dfs[guild_name] = df
        print(f"Processed {len(member_data)} members for {guild_name}")

        if not guild_dfs:
            print("❌ No guild data found")
            print("Press Enter to exit...")
            input()
            return

        # Get the directory where the executable is located
        if getattr(sys, 'frozen', False):
            # If the application is run as a bundle
            application_path = os.path.dirname(sys.executable)
        else:
            # If the application is run from a Python interpreter
            application_path = os.path.dirname(os.path.abspath(__file__))
        
        # Export to Excel in the same directory as the executable
        excel_file = os.path.join(application_path, "guild_data.xlsx")
        
        # Create Excel writer
        with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
            # Write each guild's DataFrame to a separate sheet
            for guild_name, df in guild_dfs.items():
                df.to_excel(writer, sheet_name=guild_name, index=False)
                
                # Get the worksheet
                ws = writer.sheets[guild_name]
                
                # Add dropdown to Status column
                dv = DataValidation(type="list", formula1='"OK,X"', allow_blank=True)
                last_row = ws.max_row
                dv.add(f"D2:D{last_row}")
                ws.add_data_validation(dv)
                
                # Set Verdana font and center alignment for all cells
                verdana_font = Font(name='Verdana')
                bold_italic_font = Font(name='Verdana', bold=True, italic=True)
                
                for row in ws.iter_rows(min_row=1, max_row=last_row, min_col=1, max_col=4):
                    for cell in row:
                        # Apply bold and italic to Total Level and Combat Level columns
                        if cell.column in [2, 3]:  # Columns B and C
                            cell.font = bold_italic_font
                        else:
                            cell.font = verdana_font
                        cell.alignment = Alignment(horizontal='center')

        print(f"✅ Excel file created with {len(guild_dfs)} guild tabs: {excel_file}")
        print("Press Enter to exit...")
        input()
        
    except FileNotFoundError:
        print(f"❌ Error: Could not find the file 'Untitled-1.text'")
        print("Please make sure the file is in the same folder as this program.")
        print("Press Enter to exit...")
        input()
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")
        print("Press Enter to exit...")
        input()

if __name__ == "__main__":
    # Get the directory where the executable is located
    if getattr(sys, 'frozen', False):
        # If the application is run as a bundle
        application_path = os.path.dirname(sys.executable)
    else:
        # If the application is run from a Python interpreter
        application_path = os.path.dirname(os.path.abspath(__file__))
    
    # Look for the file in the same directory as the executable
    file_path = os.path.join(application_path, "Untitled-1.text")
    extract_member_data(file_path)
