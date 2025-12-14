import React, { memo, useEffect, useMemo } from "react";
import { Image, Carousel, Collapse, Card } from "antd";
import { Marker, Popup, useMap } from "react-leaflet";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { fetchListVms } from "@/redux/middlewares/apiVmsSlice";
import { EditOutlined, SettingOutlined } from "@ant-design/icons";
import { vmsIcon } from "../../../../public/icons";
import "./styleCollapse.css";
const { Meta } = Card;
import "../stylePopup.css";
function RenderVmsMarks() {
  const dispatch = useDispatch();
  const map = useMap();
  const { listVms, status } = useSelector(
    (state) => state.apiVms,
    shallowEqual
  );
  useEffect(() => {
    if (status === "idle" && listVms.length === 0) {
      dispatch(fetchListVms());
    }
  }, [dispatch, status, listVms.length]);

  return (
    listVms.length > 0 &&
    listVms?.map((vms) => (
      <div key={vms.id}>
        <Marker
          icon={vmsIcon}
          position={vms.locationVms}
          eventHandlers={{ click: () => map.setView(vms.locationVms, 16) }}
        >
          <Popup autoClose={false} closeOnClick={false}>
            <Card
              style={{
                body: { padding: 15 },
                width: 250,
                marginTop: "25px",
                padding: "0",
              }}
              cover={
                <Carousel arrows infinite={false}>
                  <Image width={250} alt="photo" src="/images/imgvms1.jpg" />
                  <Image width={250} alt="photo" src="/images/imgvms2.jpg" />
                </Carousel>
              }
              actions={[
                <SettingOutlined key="setting" />,
                <EditOutlined key="edit" />,
              ]}
            >
              <Meta
                style={{ padding: "0", height: "auto", overflowY: "auto" }}
                title={
                  <>
                    <span style={{ textAlign: "center" }}>{vms.nameVms}</span>
                  </>
                }
                description={
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span>
                      <b>Vị trí: </b>
                      {vms.provinces}-{vms.district}-{vms.ward}
                    </span>
                    <span>
                      <b>Tuyến đường: </b>
                      {vms.routeVms}
                    </span>
                    <span>
                      <b>Chế độ hiện tại: </b>
                      {vms.modeVms ? "chế độ tự động" : "Chế độ thủ công"}
                    </span>
                    {!vms.modeVms && (
                      <>
                        <span>
                          <b>Thời gian: </b> {vms.scheduleVms.timeStart} đến{" "}
                          {vms.scheduleVms.timeEnd}
                        </span>
                        <Collapse
                          ghost
                          items={[
                            {
                              key: "1",
                              label: <b className="text-[#8c8c8c]">Nội dung</b>,
                              children: (
                                <div className="flex flex-col">
                                  <span>- {vms.titleVms1}</span>
                                  <span>- {vms.titleVms2}</span>
                                  <span>- {vms.titleVms3}</span>
                                </div>
                              ),
                            },
                          ]}
                        />
                      </>
                    )}
                  </div>
                }
              />
            </Card>
          </Popup>
        </Marker>
      </div>
    ))
  );
}
export default RenderVmsMarks;
