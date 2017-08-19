insert into Sales.Property(PropertyCode, Name, `Status`, `Type`, District, SuburbId, Address, IsEstablished, PicPath, Source, Description)
values(null, 'test 12 53', 1, 'house', null, 5, '24 sss street', 1, null, null, null);

insert into Sales.PropertySpec(PropertyId, NumOfRoom, NumOfBath, NumOfLoungeRoom, NumOfPark)
values(6, 3, 2, 1, 2);

insert into Sales.PropertySalePost(PropertyId, PurchaseType, MainPicPath, Title, Description, Email, Phone, OtherContact, CreatedByDate, UpdatedByDate)
values(6, 'Auction', '', 'title', 'description', 'haperkelu@gmail.com', '04555555', 'other contact', now(), now())

