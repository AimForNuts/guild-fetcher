import json
import pandas as pd
import os
import sys
from openpyxl import load_workbook
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.styles import Alignment, Font
from datetime import datetime

def create_empty_guild_df(guild_name):
    """Create an empty DataFrame for a guild that wasn't found."""
    return pd.DataFrame({
        "Name": [],
        "Total Level": [],
        "Combat Level": [],
        "Status": []
    })

def find_guild_file(guild_name):
    """Find the guild file regardless of extension."""
    for file in os.listdir('.'):
        if file.startswith(guild_name):
            return file
    return None

def process_guild_file(file_path):
    """Process guild file and return guild data."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Try extended format first
        if isinstance(data, dict) and 'members' in data:
            # Extended format
            members_data = []
            for member in data['members']:
                member_info = {
                    'Name': member.get('name', ''),
                    'Total Level': member.get('total_level', 'N/A'),
                    'Combat Level': member.get('combat_level', 'N/A'),
                    'Status': 'OK'
                }
                members_data.append(member_info)
            
            # Add missed members
            for missed in data.get('missed', []):
                members_data.append({
                    'Name': missed,
                    'Total Level': 'N/A',
                    'Combat Level': 'N/A',
                    'Status': 'X'
                })
                
            return members_data
            
        # Fall back to simplified format
        elif isinstance(data, dict) and 'participants' in data:
            # Simplified format
            members_data = []
            
            # Add participants
            for participant in data.get('participants', []):
                members_data.append({
                    'Name': participant,
                    'Total Level': 'N/A',
                    'Combat Level': 'N/A',
                    'Status': 'OK'
                })
            
            # Add missed members
            for missed in data.get('missed', []):
                members_data.append({
                    'Name': missed,
                    'Total Level': 'N/A',
                    'Combat Level': 'N/A',
                    'Status': 'X'
                })
                
            return members_data
            
    except Exception as e:
        print(f"Error processing {file_path}: {str(e)}")
        return None

def main():
    try:
        # Get the directory where the executable is located
        if getattr(sys, 'frozen', False):
            # If the application is run as a bundle
            application_path = os.path.dirname(sys.executable)
        else:
            # If the application is run from a Python interpreter
            application_path = os.path.dirname(os.path.abspath(__file__))
        
        # Change to the application directory
        os.chdir(application_path)
        print(f"Working directory: {application_path}")
        
        # Find all guild files
        guild_files = [f for f in os.listdir('.') if f.endswith('.json') or f.endswith('.text')]
        
        if not guild_files:
            print("No guild files found in the current directory.")
            return
        
        # Dictionary to store DataFrames for each guild
        guild_dfs = {}
        
        # Process each guild file
        for guild_file in guild_files:
            print(f"\nProcessing {guild_file}...")
            
            # Process the file
            members_data = process_guild_file(guild_file)
            
            if members_data:
                # Create DataFrame
                df = pd.DataFrame(members_data)
                
                # Sort by Status (OK first) and then by Name
                df = df.sort_values(['Status', 'Name'])
                
                # Store in dictionary
                guild_name = os.path.splitext(guild_file)[0]  # Remove extension
                guild_dfs[guild_name] = df
                print(f"Successfully processed {guild_file}")
            else:
                print(f"Failed to process {guild_file}")
        
        if not guild_dfs:
            print("No guilds were successfully processed.")
            return
        
        # Generate output filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        excel_file = f'guild_members_{timestamp}.xlsx'
        
        # Export to Excel
        with pd.ExcelWriter(excel_file, engine='openpyxl') as writer:
            # Write each guild's DataFrame to a separate sheet
            for guild_name, df in guild_dfs.items():
                df.to_excel(writer, sheet_name=guild_name, index=False)
                
                # Get the worksheet
                ws = writer.sheets[guild_name]
                
                # Add dropdown to Status column
                status_validation = DataValidation(type="list", formula1='"OK,X"', allow_blank=True)
                ws.add_data_validation(status_validation)
                status_validation.add(f'D2:D{len(df) + 1}')
                
                # Format headers
                for cell in ws[1]:
                    cell.font = Font(bold=True)
                    cell.alignment = Alignment(horizontal='center')
                
                # Center align all cells
                for row in ws.iter_rows(min_row=2):
                    for cell in row:
                        cell.alignment = Alignment(horizontal='center')
        
        print(f"✅ Excel file created with {len(guild_dfs)} guild tabs: {excel_file}")
        print("Press Enter to exit...")
        input()
        
    except Exception as e:
        print(f"❌ An unexpected error occurred: {str(e)}")
        print("Press Enter to exit...")
        input()

if __name__ == "__main__":
    main()
