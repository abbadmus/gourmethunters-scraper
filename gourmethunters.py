import schedule
import requests
from bs4 import BeautifulSoup as BS
import pandas as pd
import json
import time

product_link = []
products = []
result = []
def get_source_code(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (X11Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.75Safari/537.36'}
    resp = requests.get(url, headers=headers)
    soup = BS(resp.content, "html.parser")
    return soup

def get_product_link():
   
    category_links=['https://www.gourmethunters.com/en_US/spirits','https://www.gourmethunters.com/en_US/wines/Ros%C3%A9']
    for link in category_links:
        page_number = 1
        while page_number:
            soup = get_source_code(f"{link}?page={page_number}")
            product_link_tags = soup.find_all('div', {'class': 'title_container'})
            # print(product_link_tags)
            if product_link_tags:
                for li in product_link_tags:
                    for href in li.find_all('a'):
                        product_url = 'https://www.gourmethunters.com/' + href.get('href')
                        # if product_url not in product_link:
                        get_product_detail(product_url)
                        # print(len(product_link))
                page_number += 1
            else:
                page_number = 1
                break
    
                
def get_product_detail(product_link):
    """This function get the product details of all products"""
    soup = get_source_code(product_link)
    product_name = soup.find('div', {'class': 'data_product_detail item_parker'}).h1.text.strip()
    product_price = soup.find('div', {'class': 'data_product_detail item_parker'}).p.text.strip().strip('(Inc. VAT bot. 75 cl.)').strip()
    parker_points = soup.find('div', {'class': 'item_points'})
    # if( (parker_points is None) or (len(parker_points) == 0)):
    #     continue
    result.append(parker_points)
    # parker_points = result[0].get_text().split('Parker Points:')[1].strip()
    try:
        penin_points = soup.select('body > section > div > div.row > div:nth-child(2) > div.data_product_detail.item_parker > div:nth-child(6) > div.col-xs-8.col-sm-12.col-md-12.col-lg-12.no-padding-right > div:nth-child(2) > div > div.points > div > div:nth-child(2) > div > span:nth-child(2)')[0].text
    except IndexError:
        penin_points = None
    type_of_wine = soup.find('div', {'class': 'des_featured'}).p.text.strip()
    pairing = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(1) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    style = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(2) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    winery = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(3) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    size = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(3) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    try:
        country = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(4) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p > a')[0].text.strip()
        print(country)
    except IndexError:
        country = None
    else:
        country == soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(2) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p > a')
        print(country)
    
    try:
        region = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(4) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    
    except IndexError:
        region = None
    try:
        apellation = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(5) > div:nth-child(1) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    
    except IndexError:
        apellation = None    
    try:
        alcohol = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(5) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    except IndexError:
        alcohol = None
    try:
        grapes = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(6) > div:nth-child(1) > div:nth-child(1) > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    except IndexError:
        grapes = None
    try:
        wine_making = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(6) > div:nth-child(2) > div > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    except IndexError:
        wine_making = None
    try:
        serving = soup.select('body > section > div > div.row > div:nth-child(2) > div.features_product_detail > div > div:nth-child(6) > div:nth-child(1) > div:nth-child(2) > div.col-xs-8.col-sm-8.col-md-8.col-lg-8.no-padding-left > div > p')[0].text.strip()
    except IndexError:
        serving = None
    try:
        product_description = soup.select('bo/Sdy > section > div > div.row > div:nth-child(2) > div.description_product_detail > p')[0].text.strip()
    except IndexError:
        product_description = None
    image_url = soup.select('#carousel-product-detail > div > div.item.zb.active > img')[0]['src']
    print(result)
    
    # data = {"Product Name": product_name,
    #     "Price": product_price, 
    #     "Parker Points":parker_points, 
    #     "Penin Points": penin_points,
    #     "Type of Wine": type_of_wine,
    #     "Pairing": pairing,
    #     "Style": style,
    #     "Winery": winery,
    #     "Size": size,
    #     "Country": country,
    #     "Region": region,
    #     "Apellation": apellation,
    #     "Alcohol": alcohol,
    #     "Grapes": grapes,
    #     "Wine Making": wine_making,
    #     "Serving": serving,
    #     "Product Description": product_description,
    #     "Product Url": url,
    #     "Image Url": image_url
        
    #     }
    
    # products.append(data)
    # print(products)
    # df = pd.DataFrame.from_dict(products, orient='columns')
    # df.to_excel("product_data_sheet.xlsx")
    # print('done')

get_product_link()



