from PIL import Image

imgs = ['0C1.jpg', '0C2.jpg', '1C1.jpg', '1C2.jpg', '1C3.jpg', '1C4.jpg', '1O1.jpg', '1O2.jpg', '1R1.jpg', '1R2.jpg', '1R3.jpg', '1R4.jpg', '1R5.jpg', '1T1.jpg', '1T2.jpg', '2C1.jpg', '2C2.jpg', '2C3.jpg', '2R1.jpg', '2R2.jpg', '2R3.jpg', '2R4.jpg', '2T1.jpg', '2T2.jpg', '4C1.jpg', '4C2.jpg', '4C3.jpg', '4C4.jpg', '4C5.jpg', '4C6.jpg', 'main.jpg']
for i in imgs:
    j = "C:\\Users\\Aarjav\\Documents\\campus-kota\\public\\images\\riddhi-siddhi\\" + i
    im1 = Image.open(j)
    im1.save("C:\\Users\\Aarjav\\Documents\\campus-kota\\public\\images\\riddhi-siddhi\\" + i[0:3] + ".png")