import pandas as pd
import random
import time
import numpy as np
import matplotlib
matplotlib.use("Agg")  
import matplotlib.pyplot as plt
from datetime import datetime , timedelta
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import os

def clean_traffic(filepath):
    try:
        df = pd.read_csv(filepath)
        df.dropna(inplace=True)
        if 'Time' in df.columns:
            n = len(df)
            now = datetime.now()
            end_time = now - timedelta(hours=3)
            start_time = end_time - timedelta(hours=24)
            df['Time'] = [
                start_time + timedelta(seconds=i * (24 * 3600 / n))
                for i in range(n)
            ]
            df['Time'] = pd.to_datetime(df['Time'], errors='coerce')
            df.dropna(subset=['Time'], inplace=True)

        else:
            print("⚠️ Warning: 'Time' column not found in the dataset")
        df.reset_index(drop=True, inplace=True)
        # Return selected columns only (Date/Time, Total vehicles, Traf0ficSituation)
        if all(col in df.columns for col in ['Time', 'Total', 'Traffic Situation']):
            df = df[['Time', 'Total', 'Traffic Situation']]
            df['timestamp']=(df['Time']-df['Time'].min()).dt.total_seconds()
            
        else:
            print("⚠️ Some expected columns missing (Time, Total, TrafficSituation)")
        return df
    except Exception as e:
        print(f"❌ Error while cleaning data: {e}")
        return pd.DataFrame()
    
def train_model(df):
    try:
        if df is None or df.empty:
            print("Error: DataFrame is empty or None")
            return None
        X=df[["timestamp"]]
        y=df["Total"]
        
        X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)
        model=RandomForestRegressor(n_estimators=100,random_state=42)
        model.fit(X_train,y_train)
        y_pred=model.predict(X_test)
        
        return model
    except Exception as e:
        print(f"Error during model training: {e}")
        return None
def predict_traffic(model,df,hours=3):
    try:
        
        last_time=df['Time'].max()
        future_times=[last_time + timedelta(hours = i) for i in range (1,hours+1)]
        future_timestramps_values =np.array([(t - df['Time'].min()).total_seconds() for t in future_times]).reshape(-1,1)
        future_timestramps = pd.DataFrame(future_timestramps_values, columns=['timestamp'])
        predictions=model.predict(future_timestramps)
        pred_df = pd.DataFrame({
            'Time': future_times,
            'Total': predictions.astype(int),
            'Traffic Situation': ['High' if pred > 80 else 'Medium' if pred > 40 else 'Low' for pred in predictions]
            
        })
        return pred_df
    except Exception as e:
        print(f"Error during traffic prediction: {e}")
        return "error during prediction"
 

def main(filepath):
    df=clean_traffic(filepath)
    model=train_model(df)
    pred_df=predict_traffic(model,df,hours=3)
 

    end_time_hist = df['Time'].max()
    start_time_hist = end_time_hist - timedelta(hours=24)

    # Calculate the start time for the historical data (24 hours ago, excluding the 3 predicted hours)
    # This is 21 hours before the current max time
    history_cutoff_time = df['Time'].max() - timedelta(hours=0)
    
    # 3. Filter the Historical 21 Hours
    # Note: We filter data from the entire original dataset (df)
    historical_df = df[
        (df['Time'] >= start_time_hist) & 
        (df['Time'] < history_cutoff_time)
    ].copy() # Ensure we use a copy to avoid SettingWithCopyWarning
    
    # Select only the relevant columns for the historical data
    historical_df = historical_df[['Time', 'Total', 'Traffic Situation']]
    
    # 4. Combine the 21 hours of history and the 3 hours of future prediction
    final_24h_df = pd.concat([historical_df, pred_df], ignore_index=True)
    
    # 5. Sort the final data by time (just to be safe)
    final_24h_df.sort_values(by='Time', inplace=True,ascending=False)
    
    # 6. Print and Return the Result
    print(f"\n✅ 24-Hour Traffic Data Generated:")
    print(f"   - {len(historical_df)} historical entries (21 hours)")
    print(f"   - {len(pred_df)} predicted entries (3 hours)")
    print(f"   - Total {len(final_24h_df)} entries covering 24 hours.")
    
    return final_24h_df



        
        


def clean_airquality(filepath):
    try:
        df=pd.read_csv(filepath,sep=',')
        df.dropna(inplace=True)
        if 'Time' in df.columns:
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )
        else:

            n=len(df)
            now=datetime.now()
            end_time = now -timedelta(hours=3)
            start_time = end_time-timedelta(hours=24)
            df['Time']=[start_time +timedelta(seconds=i * (24*3600/n)) for i in range(n)]
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )
        df = df.dropna(subset=['Time'])
        # Reset index
        df.reset_index(drop=True, inplace=True)
        return df
    except Exception as e:
        print(f"Error while cleaning the data: {e}")
        return []
    
def train_model_airquality(df):
    try:
        df=pd.DataFrame(df)
        if df is None or df.empty:
            print("Error: DataFrame is empty or None")
            return None
        X=df[["Time"]]
        y=df[["PM10","PM2.5","NO2"]]
        X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)
        model=RandomForestRegressor(n_estimators=100,random_state=42)
        model.fit(X_train,y_train)
        y_pred=model.predict(X_test)
        return model
    except Exception as e:
        print(f"Error during model training: {e}")
        return None
    
def predict_airquality(model,df,hours=3):
    try:
        last_time=df['Time'].max()
        future_times=[last_time + timedelta(hours = i) for i in range (1,hours+1)]
        future_times_df = pd.DataFrame(future_times, columns=['Time'])
        predictions=model.predict(future_times_df)
        pred_df = pd.DataFrame({
            'Time': future_times,
            'PM10': predictions[:,1].astype(int),
            'PM2.5': predictions[:,0].astype(int),
            'NO2': predictions[:,2].astype(int)
        })
        return pred_df
    except Exception as e:
        print(f"Error during air quality prediction: {e}")
        return pd.DataFrame()

    
def main_airquality(filepath):
    df = clean_airquality(filepath)
    df=pd.DataFrame(df)
    model = train_model_airquality(df)
    pred_df = predict_airquality(model, df, hours=3)
    end_time_hist = df['Time'].max()
    start_time_hist = end_time_hist - timedelta(hours=24)

    # Calculate the start time for the historical data (24 hours ago, excluding the 3 predicted hours)
    # This is 21 hours before the current max time
    history_cutoff_time = df['Time'].max() - timedelta(hours=0)
    
    # 3. Filter the Historical 21 Hours
    # Note: We filter data from the entire original dataset (df)
    historical_df = df[
        (df['Time'] >= start_time_hist) & 
        (df['Time'] < history_cutoff_time)
    ].copy() # Ensure we use a copy to avoid SettingWithCopyWarning
    
    # Select only the relevant columns for the historical data
    historical_df = historical_df[['Time', 'PM10', 'PM2.5', 'NO2']]
    
    # 4. Combine the 21 hours of history and the 3 hours of future prediction
    final_24h_df = pd.concat([historical_df, pred_df], ignore_index=True)
    
    # 5. Sort the final data by time (just to be safe)
    final_24h_df.sort_values(by='Time', inplace=True,ascending=False)
    
    # 6. Print and Return the Result
    print(f"\n✅ 24-Hour Traffic Data Generated:")
    print(f"   - {len(historical_df)} historical entries (21 hours)")
    print(f"   - {len(pred_df)} predicted entries (3 hours)")
    print(f"   - Total {len(final_24h_df)} entries covering 24 hours.")
    
    return final_24h_df



def clean_Energy(filepath):
    try:
        df=pd.read_csv(filepath,sep=',')
        df.dropna(inplace=True)
        if 'Time' in df.columns:
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )
        else:
            n=len(df)
            now = datetime.now()
            end_time = now - timedelta(hours=3)
            start_time = end_time - timedelta(hours=24)
            df['Time']=[start_time +timedelta(seconds=i * (24*3600/n)) for i in range(n)]
            df['Time']=pd.to_datetime(df['Time'],errors='coerce',format='%Y-%m-%d %H:%M:%S' )
        df = df.dropna(subset=['Time'])
        # Reset index
        df.reset_index(drop=True, inplace=True)
        return df
    except Exception as e:
        print(f"Error while cleaning the data: {e}")
        return pd.DataFrame()
    
def train_energy_model(df):
    try:
        if df is None or df.empty:
            print("Error: DataFrame is empty or None")
            return None
        X=df[['Time']]
        y=df['biofuel_electricity']
        X_train,X_test,y_train,y_test = train_test_split(X,y,test_size=0.2,random_state=42)
        model=RandomForestRegressor(n_estimators=100,random_state=42)
        model.fit(X_train,y_train)
        return model
    except Exception as e:
        print(f"Error during model training: {e}")
        return None
    
def predict_energy(model,df,hours=3):
    try:
        last_time=df['Time'].max()
        future_times=[last_time + timedelta(hours=i) for i in range (1,hours+1)]
        future_times_df = pd.DataFrame(future_times, columns=['Time'])
        predictions=model.predict(future_times_df.values.reshape(-1,1))
        pred_df = pd.DataFrame({
            'Time': future_times,
            'biofuel_electricity': predictions.astype(int)
        })
        return pred_df
    except Exception as e:
        print(f"Error during energy prediction: {e}")
        return pd.DataFrame()
    
def main_energy(filepath):
    df=clean_Energy(filepath)
    df=pd.DataFrame(df)
    model=train_energy_model(df)
    pred_df=predict_energy(model,df,hours=3)
    
    end_time_hist = df['Time'].max()
    start_time_hist = end_time_hist - timedelta(hours=24)   
    history_cutoff_time = df['Time'].max() - timedelta(hours=0)
    historical_df = df[
        (df['Time'] >= start_time_hist) & 
        (df['Time'] < history_cutoff_time)
    ].copy()
    historical_df = historical_df[['Time', 'biofuel_electricity']]
    final_24h_df = pd.concat([historical_df, pred_df], ignore_index=True)
    final_24h_df.sort_values(by='Time', inplace=True,ascending=False)
    print(f"\n✅ 24-Hour Energy Data Generated:")
    print(f"   - {len(historical_df)} historical entries (21 hours)")
    print(f"   - {len(pred_df)} predicted entries (3 hours)")
    print(f"   - Total {len(final_24h_df)} entries covering 24 hours.")
    return final_24h_df







    
    
    
#      git remote add origin https://github.com/Nishan487/Smart-City-Analyzer.git
# git branch -M main
# git push -u origin main