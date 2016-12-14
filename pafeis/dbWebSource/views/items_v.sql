CREATE VIEW dbo.items_v
AS
SELECT        dbo.items.item_id, dbo.items.item_code_id, dbo.item_codes.item_name, dbo.item_codes.part_no, dbo.item_codes.national_stock_no, dbo.items.serial_no, dbo.items.manufacturer_id, 
                         dbo.getManufacturerName(dbo.items.manufacturer_id) AS manufacturer_name, dbo.items.dealer_id, dbo.getDealerName(dbo.items.dealer_id) AS dealer_name, dbo.items.supply_source_id, 
                         dbo.getSupplySourceName(dbo.items.supply_source_id) AS supply_source_name, dbo.items.time_since_new, dbo.items.time_before_overhaul, dbo.items.time_since_overhaul, dbo.items.remaining_time_hr, 
                         dbo.items.remaining_time_min, dbo.items.date_delivered, dbo.items.aircraft_info_id, dbo.aircraft_info.aircraft_name, dbo.items.date_issued, dbo.items.status_id
FROM            dbo.items INNER JOIN
                         dbo.aircraft_info ON dbo.items.aircraft_info_id = dbo.aircraft_info.aircraft_info_id INNER JOIN
                         dbo.item_codes ON dbo.items.item_code_id = dbo.item_codes.item_code_id

