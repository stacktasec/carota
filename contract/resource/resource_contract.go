package main

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

const (
	USER_TYPE        = "user"
	RESOURCE_TYPE    = "resource"
	GAINHISTORY_TYPE = "gain_history"
)

type ResourceContract struct{}

type User struct {
	ID            string        `json:"id"`
	Username      string        `json:"username"`
	Resources     []Resource    `json:"resources"`
	GainHistories []GainHistory `json:"gain_histories"`
}

type Resource struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Price int    `json:"price"`
}

type GainHistory struct {
	ID         string `json:"id"`
	UserId     string `json:"user_id"`
	ResourceID string `json:"resource_id"`
	GainTime   string `json:"gain_time"`
}

func (c *ResourceContract) Init(stub shim.ChaincodeStubInterface) pb.Response {
	fmt.Println("Welcome to use resource contract!")
	return shim.Success(nil)
}

func (c *ResourceContract) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	funcName, args := stub.GetFunctionAndParameters()

	switch funcName {
	case "registerUser":
		return registerUser(stub, args)
	case "getAllUser":
		return getAllUser(stub, args)
	default:
		return shim.Error(fmt.Sprintf("unsupported function: %s", funcName))
	}

}

func registerUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	// 套路1：检查参数的个数
	if len(args) != 1 {
		return shim.Error("not enough args")
	}

	// 套路2：验证参数的正确性
	name := args[0]
	if name == "" {
		return shim.Error("invalid args")
	}

	uuidStr := uuid.New().String()
	userKey, err := stub.CreateCompositeKey(USER_TYPE, []string{
		uuidStr,
	})
	if err != nil {
		shim.Error(fmt.Sprintf("create composite key error: %s", err))
	}

	// 套路3：验证数据是否存在 应该存在 or 不应该存在
	if userBytes, err := stub.GetState(userKey); err == nil && len(userBytes) != 0 {
		return shim.Error("user already exist")
	}

	// 套路4：写入状态
	user := &User{
		ID:            uuidStr,
		Username:      name,
		Resources:     make([]Resource, 0),
		GainHistories: make([]GainHistory, 0),
	}

	// 序列化对象
	userBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshal user error: %s", err))
	}

	if err := stub.PutState(userKey, userBytes); err != nil {
		return shim.Error(fmt.Sprintf("register user error: %s", err))
	}

	// 成功返回
	return shim.Success(nil)
}

func getAllUser(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	// 套路1：检查参数的个数
	if len(args) != 0 {
		return shim.Error("not enough args")
	}

	result, err := stub.GetStateByPartialCompositeKey(USER_TYPE, []string{})
	if err != nil {
		return shim.Error(fmt.Sprintf("get all user list error: %s", err))
	}
	defer result.Close()

	users := make([]*User, 0)
	if result.HasNext() {
		userKV, err := result.Next()
		if err != nil {
			return shim.Error(fmt.Sprintf("query next user error: %s", err))
		}

		user := new(User)
		if err := json.Unmarshal(userKV.GetValue(), user); err != nil {
			return shim.Error(fmt.Sprintf("unmarshal error: %s", err))
		}

		users = append(users, user)
	}

	userBytes, err := json.Marshal(users)
	if err != nil {
		return shim.Error(fmt.Sprintf("marshal error: %s", err))
	}

	return shim.Success(userBytes)

}

func main() {
	err := shim.Start(new(ResourceContract))
	if err != nil {
		fmt.Printf("Error starting resource contract: %s", err)
	}
}
