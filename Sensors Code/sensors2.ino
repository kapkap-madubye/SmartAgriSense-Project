

//CAPACITIVE SOIL MOISTURE SENSOR
int moistureValue = 0;    // Variable to store the moisture level
int dryThreshold = 700;   // Adjust this threshold for your soil
int wetThreshold = 300;   // Adjust this threshold for your soil
int SOIL_MOISTURE_SENSOR_PIN= A0;
int greenPin =10;
int redPin=13;
int yellowPin=11;


//TEMPERATURE SENSOR
#include <OneWire.h>
#include <DallasTemperature.h>

int TEMPERATURE_DIGITAL_PIN =4;
OneWire oneWire(TEMPERATURE_DIGITAL_PIN); 
// Pass oneWire reference to DallasTemperature 444library
DallasTemperature sensors(&oneWire);


//SCREEN LIB
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
LiquidCrystal_I2C lcd(0x27,16,2);  // set the LCD address to 0x27 for a 16 chars and 2 line display


 
#include <AltSoftSerial.h>
 
// RO4 to pin 8 & DI to pin 9 when using AltSoftSerial
#define RE 6
#define DE 7
 
const byte nitro[] = {0x01, 0x03, 0x00, 0x1e, 0x00, 0x01, 0xe4, 0x0c};
const byte phos[] = {0x01, 0x03, 0x00, 0x1f, 0x00, 0x01, 0xb5, 0xcc};
const byte pota[] = {0x01, 0x03, 0x00, 0x20, 0x00, 0x01, 0x85, 0xc0};
 
byte values[11];
AltSoftSerial mod;

void setup() {
  sensors.begin();  // Start up the library
  Serial.begin(9600);

  mod.begin(9600);
  pinMode(greenPin, OUTPUT);
  pinMode(yellowPin, OUTPUT);
  pinMode(redPin, OUTPUT);
  
  pinMode(RE, OUTPUT);
  pinMode(DE, OUTPUT);
  // put RS-485 into receive mode
  digitalWrite(DE, LOW);



  
 // lcd.init();     
  lcd.begin();
  lcd.backlight(); // Make sure backlight is on

  
  // Print a message on both lines of the LCD.
  lcd.setCursor(0,0);   //Set cursor to character 0 on line 0
  lcd.print("Loading..30");
  delay(600);
  lcd.clear();
  lcd.print("Loading..69");
  delay(600);
  lcd.clear();
  lcd.print("Loading..99");
  delay(600);
  
}


void loop() {
   String topText = "";
   String bottomText = "";
   topText+="Soil:";

   
  // Read the Analog Input and print it
    Serial.print("Soil");
    Serial.print("=");
   int soilMoistureValue  = analogRead(SOIL_MOISTURE_SENSOR_PIN);
  
   if (soilMoistureValue < wetThreshold) {

           digitalWrite(yellowPin, HIGH);
               digitalWrite(greenPin, LOW);
                    digitalWrite(redPin, LOW);
           Serial.println("wet");
         topText+="Wet ";
        
          
    } else if (soilMoistureValue > dryThreshold) {
      digitalWrite(redPin, HIGH);
             digitalWrite(yellowPin, LOW);
             digitalWrite(greenPin, LOW);

         Serial.print("dry");
         topText+="Dry ";
        
    } else {
       digitalWrite(greenPin, HIGH);
       digitalWrite(redPin, LOW);
       digitalWrite(yellowPin, LOW);
         Serial.print("normal");
         topText+="Good ";
        
    }
    Serial.print("--");
    //int SOIL_MOISTURE_SENSOR_PIN= A0;
  //int sensorVal=analogRead(A0);
  //int HumidityPerc=map(sensorVal,wet,dry,100,0);
  //Serial.print(Humidity);
  //Serial.print(HumidityPerc);
  //Serial.println("%");
  //topText+=string(HumidityPerc);
 

    Serial.print("Temp");
    Serial.print("=");
     // Send the command to get temperatures
    sensors.requestTemperatures(); 
    Serial.print(sensors.getTempCByIndex(0));
    topText+="Tp:" +String((int)sensors.getTempCByIndex(0));
    Serial.print("--");


    Serial.print("Nitrogen: ");
    byte nitro = (nitrogen()); //../100*300
    Serial.print("=");
    Serial.print(nitro);
    Serial.print("--");
    //delay(250);
   
    Serial.print("Phosphorous: ");
    byte phos = phosphorous();
    Serial.print("=");
    Serial.print(phos);
    Serial.print("--");
    //delay(250);
   
    Serial.print("Potassium: ");
    byte pota = potassium();
    Serial.print("=");
    Serial.print(pota);
    Serial.print("--");
    //delay(250);

    

     lcd.clear();
     lcd.setCursor(0,0);   //Set cursor to character 0 on line 0
     lcd.print(topText);

     bottomText+="N"+String(nitro);
     bottomText+=" P"+String(phos);
     bottomText+=" K"+String(pota);
     lcd.setCursor(0,1);
     lcd.print(bottomText);
     Serial.println("");
  
  // Take a reading every second
  delay(50000);
}



 
byte nitrogen() {
  // clear the receive buffer
  mod.flushInput();
 
  // switch RS-485 to transmit mode
  digitalWrite(DE, HIGH);
  digitalWrite(RE, HIGH);
  delay(1);
 
  // write out the message
  for (uint8_t i = 0; i < sizeof(nitro); i++ ) mod.write( nitro[i] );
 
  // wait for the transmission to complete
  mod.flush();
  
  // switching RS485 to receive mode
  digitalWrite(DE, LOW);
  digitalWrite(RE, LOW);
 
  // delay to allow response bytes to be received!
  delay(200);
 
  // read in the received bytes
  for (byte i = 0; i < 7; i++) {
    values[i] = mod.read();
    //Serial.print(values[i], HEX);
    //Serial.print(' ');
  }
  return values[4];
}
 
byte phosphorous() {
  mod.flushInput();
  digitalWrite(DE, HIGH);
  digitalWrite(RE, HIGH);
  delay(1);
  for (uint8_t i = 0; i < sizeof(phos); i++ ) mod.write( phos[i] );
  mod.flush();
  digitalWrite(DE, LOW);
  digitalWrite(RE, LOW);
// delay to allow response bytes to be received!
  delay(200);
  for (byte i = 0; i < 7; i++) {
    values[i] = mod.read();
    //Serial.print(values[i], HEX);
    //Serial.print(' ');
  }
  return values[4];
}
 
byte potassium() {
  mod.flushInput();
  digitalWrite(DE, HIGH);
  digitalWrite(RE, HIGH);
  delay(1);
  for (uint8_t i = 0; i < sizeof(pota); i++ ) mod.write( pota[i] );
  mod.flush();
  digitalWrite(DE, LOW);
  digitalWrite(RE, LOW);
// delay to allow response bytes to be received!
  delay(200);
  for (byte i = 0; i < 7; i++) {
    values[i] = mod.read();
   // Serial.print(values[i], HEX);
    //Serial.print(' ');
  }
  return values[4];
}
