import pandas as pd

def convert_excel_to_json(excel_file):
    # Replace 'path_to_excel_file' with the actual path to your Excel file
    data_frame = pd.read_excel(excel_file + '.xlsx')

    # Convert the data frame to JSON and specify the orientation as 'records'
    json_data = data_frame.to_json(orient='records')

    # Save the JSON data to a file
    with open(excel_file + '.json', 'w') as file:
        file.write(json_data)

    print('Excel data has been converted to JSON and saved to narrators.json')

convert_excel_to_json('narrators')
convert_excel_to_json('hadiths')
