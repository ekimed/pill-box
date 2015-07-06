# pill-box
Application that takes Blue Button VA data and creates an easy to read medication list

Start up elasticsearch:
type in terminal: elasticsearch-1.6.0/bin/elasticsearch

Load up elasticsearch with drug data:
cd src/server/process
node load_meds.js

Start up the app:
cd src/server
node app.js

Upload a VA blue button text file, a sample is found in the test_data folder:
Test file located in src/server/test_data: VA_My_HealtheVet_Blue_Button_Sample_DDI.txt

Application parses text file and retrieves a list of all active medications.

The names of the medications are normalized using the NLM RxTerms API. This is to standardize the names for consistent data.

Drug interactions are checked for using the Drug Interaction API
If DDI's are detected, Clicking the exclamation tooltip shows a modal dialog of the drug interaction pairs
