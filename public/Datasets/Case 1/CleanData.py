import pandas as pd
import numpy as np

# List all csv's in selected path
import glob
all_files = glob.glob("Case 1/Raw/*.csv")

# create a new csv in Clean folder which will compund all the data
with open('Case 1/Clean/AllData.csv', 'w') as f:

    for file in all_files:

        case = pd.read_csv(file, sep=',', header=0, index_col=0)

        # drop index column

        case.reset_index(drop=True, inplace=True)

        Drop = ['datetime', 'feelslike', 'precipprob', 'preciptype', 'snow', 'snowdepth',
                'windgust', 'sealevelpressure', 'visibility', 'uvindex', 'solarenergy',
                'severerisk', 'conditions', 'icon', 'stations']

        # drop the colums whose names are in the list Drop

        for column in Drop:
            case.drop(column, axis=1, inplace=True)

        all_data = case.to_csv(f, header=True)

# print column name
print(case.columns)
