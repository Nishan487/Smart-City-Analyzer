import pandas as pd
from datetime import datetime , timedelta

# def get_latest_data(file_path, value_column):
#     df = pd.read_csv(file_path)
#     latest_value = df[value_column].iloc[-1]  # last row
#     latest_time = datetime().strftime("%H:%M:%S")
#     return {"value": float(latest_value), "time": latest_time}


def clean_traffic(filepath):
    try:
        df = pd.read_csv(filepath)
        # Drop missing rows
        df.dropna(inplace=True)
        # Check if Time' column exists
        if 'Time' in df.columns:
            df['Time'] = pd.to_datetime(df['Time'],errors='coerce')
        else:
            print(" Warning: 'Time' column not found in the dataset")
        # Optional: remove invalid times
        df = df.dropna(subset=['Time']) if 'Time' in df.columns else df
        # Reset index
        df.reset_index(drop=True, inplace=True)
        return df.to_dict(orient='records')  # Return JSON-like data for API
    except Exception as e:
        print(f"❌ Error while cleaning data: {e}")
        return []

def clean_airquality(filepath):
    try:
        df=pd.read_csv(filepath,sep=';')
        df.dropna(inplace=True)
        if 'Time' in df.columns:
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )
        else:

            n=len(df)
            end_time=datetime.now()
            start_time = end_time-timedelta(hours=12)
            df['Time']=[start_time +timedelta(seconds=i * (24*3600/n)) for i in range(n)]
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )

            
        # df=df.dropna(subset=['Time']) if 'Time' in df.columns else df
        # df.reset_index(drop=True,inplace=True)
        df = df.dropna(subset=['Time'])
        # Reset index
        df.reset_index(drop=True, inplace=True)
        return df.to_dict(orient='records')
    except Exception as e:
        print(f"Error while cleaning the data: {e}")
        return []
    